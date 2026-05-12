'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'docoolture_wishlist'

function readStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function writeStorage(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function useWishlist() {
  const [liked, setLiked] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLiked(readStorage())
  }, [])

  const isLiked = useCallback((id: string) => liked.has(id), [liked])

  const toggle = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      writeStorage(next)
      return next
    })
  }, [])

  return { isLiked, toggle }
}
