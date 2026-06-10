import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2'

const SYSTEM_PROMPT = `Eres Coco, el asistente virtual de DoCoolture — la plataforma de experiencias auténticas en la República Dominicana. Tu misión es ayudar a los visitantes y locales a descubrir las mejores experiencias, lugares y actividades del país.

Conoces profundamente la cultura dominicana: la música (merengue, bachata, salsa), la gastronomía (sancocho, mangú, tostones, chicharrón de pollo), las playas (Punta Cana, Las Terrenas, Samaná, Bahía de las Águilas), los destinos históricos (Zona Colonial de Santo Domingo, la primera ciudad europea del Nuevo Mundo), y las actividades de aventura (senderismo en Pico Duarte, whale watching en Samaná).

Cuando tengas información de experiencias disponibles en la plataforma, menciónalas de forma natural en tu respuesta. Siempre responde en el idioma del usuario (español o inglés). Sé amigable, entusiasta y conciso. Si el usuario pregunta algo fuera de tu conocimiento sobre RD o experiencias, admítelo con gracia y sugiere alternativas.`

async function searchExperiences(query: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3)

    const { data } = await supabase
      .from('experiences')
      .select('title, short_description, category, city, price_usd, average_rating, handle')
      .eq('is_published', true)
      .eq('is_hidden', false)
      .or(keywords.map(k => `title.ilike.%${k}%,tags.cs.{${k}},category.ilike.%${k}%`).join(','))
      .limit(4)

    return data ?? []
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
      const error = await ollamaResponse.text()
      return NextResponse.json(
        { error: `Ollama error: ${error}` },
        { status: 502 }
      )
    }

    // Stream the Ollama response directly to the client
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaResponse.body!.getReader()
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
