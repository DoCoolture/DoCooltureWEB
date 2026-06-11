import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const CHAT_ENABLED = process.env.CHAT_ENABLED !== 'false'
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2'

// In-memory rate limiter: max 20 messages per user per minute.
// ⚠️  PRODUCTION LIMITATION: each serverless invocation gets its own process so this map
// resets on every cold start and is never shared across instances.
// Effective only in single-process environments (local dev, Docker).
// For real rate limiting in production, replace with Upstash Redis + @upstash/ratelimit.
if (process.env.NODE_ENV === 'production') {
  console.warn('[chat] In-memory rate limiter is active but ineffective in serverless environments. Add Upstash Redis for real rate limiting.')
}
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 60_000

function isRateLimited(userId: string): boolean {
  const now = Date.now()

  // Prune expired entries on every call to prevent unbounded map growth
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }

  const entry = rateLimitMap.get(userId)

  if (!entry) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) return true
  entry.count++
  return false
}

const SYSTEM_PROMPT = `Eres Coco, el asistente virtual de DoCoolture — la plataforma de experiencias auténticas en la República Dominicana. Tu misión es ayudar a los visitantes y locales a descubrir las mejores experiencias, lugares y actividades del país.

Conoces profundamente la cultura dominicana: la música (merengue, bachata, salsa), la gastronomía (sancocho, mangú, tostones, chicharrón de pollo), las playas (Punta Cana, Las Terrenas, Samaná, Bahía de las Águilas), los destinos históricos (Zona Colonial de Santo Domingo, la primera ciudad europea del Nuevo Mundo), y las actividades de aventura (senderismo en Pico Duarte, whale watching en Samaná).

Cuando tengas información de experiencias disponibles en la plataforma, menciónalas de forma natural en tu respuesta. Siempre responde en el idioma del usuario (español o inglés). Sé amigable, entusiasta y conciso. Si el usuario pregunta algo fuera de tu conocimiento sobre RD o experiencias, admítelo con gracia y sugiere alternativas.`

async function searchExperiences(query: string) {
  try {
    const supabase = await createSupabaseServerClient()
    // Strip PostgREST special characters before building the filter string
    const sanitize = (w: string) => w.replace(/[^a-zA-ZÀ-ÿ0-9]/g, '')
    const keywords = query
      .toLowerCase()
      .split(' ')
      .map(sanitize)
      .filter(w => w.length > 3)

    if (keywords.length === 0) return []

    const { data } = await supabase
      .from('experiences')
      .select('title, short_description, category, city, price_usd, average_rating, handle')
      .eq('is_published', true)
      .eq('is_hidden', false)
      .or(keywords.map(k => `title.ilike.%${k}%,category.ilike.%${k}%`).join(','))
      .limit(4)

    return data ?? []
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  if (!CHAT_ENABLED) {
    return NextResponse.json({ error: 'Chat no disponible.' }, { status: 503 })
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (isRateLimited(user.id)) {
      return NextResponse.json({ error: 'Demasiados mensajes. Espera un momento.' }, { status: 429 })
    }

    const { messages } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages requeridos' }, { status: 400 })
    }

    // Sanitize: only allow user/assistant roles to prevent system prompt injection
    const safeMessages = messages
      .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0
      )
      .slice(-20) // cap history to last 20 messages

    if (safeMessages.length === 0) {
      return NextResponse.json({ error: 'messages requeridos' }, { status: 400 })
    }

    const lastUserMessage = safeMessages.findLast((m) => m.role === 'user')
    const experiences = lastUserMessage
      ? await searchExperiences(lastUserMessage.content)
      : []

    let systemWithContext = SYSTEM_PROMPT
    if (experiences.length > 0) {
      const expList = experiences
        .map(
          e =>
            `- ${e.title} (${e.category}, ${e.city}) — $${e.price_usd} USD — Rating: ${e.average_rating?.toFixed(1) ?? 'N/A'} — ${e.short_description ?? ''}`
        )
        .join('\n')
      systemWithContext += `\n\nExperiencias relevantes disponibles ahora en DoCoolture:\n${expList}\n\nMenciona estas experiencias si son pertinentes a la pregunta del usuario.`
    }

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: true,
        messages: [
          { role: 'system', content: systemWithContext },
          ...safeMessages,
        ],
        options: {
          temperature: 0.7,
          num_predict: 512,
        },
      }),
    })

    if (!ollamaResponse.ok) {
      console.error('[chat] Ollama error:', await ollamaResponse.text())
      return NextResponse.json(
        { error: 'El asistente no está disponible en este momento.' },
        { status: 502 }
      )
    }

    // Stream the Ollama response directly to the client
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        if (!ollamaResponse.body) { controller.close(); return }
        const reader = ollamaResponse.body.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(Boolean)

            for (const line of lines) {
              try {
                const json = JSON.parse(line)
                const token = json.message?.content ?? ''
                if (token) {
                  controller.enqueue(encoder.encode(token))
                }
                if (json.done) {
                  controller.close()
                  return
                }
              } catch {
                // skip malformed JSON lines
              }
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
