'use client'

import { useCallback, useRef, useState } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (text: string) => Promise<void>
  clearMessages: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  // Refs to avoid stale closures — always reflects current state without re-creating the callback
  const messagesRef = useRef<ChatMessage[]>([])
  const isLoadingRef = useRef(false)

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoadingRef.current) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    const assistantId = crypto.randomUUID()
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    // Build history from ref (always current) before setState batch
    const history = [...messagesRef.current, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }))

    setMessages(prev => {
      // Remove any pre-existing empty assistant placeholders left by a prior abort
      const clean = prev.filter(m => !(m.role === 'assistant' && m.content === ''))
      const next = [...clean, userMessage, assistantMessage]
      messagesRef.current = next
      return next
    })
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? `Error ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const next = prev.map(m =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
          messagesRef.current = next
          return next
        })
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // Clean up the placeholder that was left when this request was aborted
        setMessages(prev => {
          const next = prev.filter(m => m.id !== assistantId)
          messagesRef.current = next
          return next
        })
        return
      }
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      setMessages(prev => {
        const next = prev.filter(m => m.id !== assistantId)
        messagesRef.current = next
        return next
      })
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, []) // no deps needed — reads live values via refs

  const clearMessages = useCallback(() => {
    abortRef.current?.abort()
    messagesRef.current = []
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearMessages }
}
