'use client'

import { HARDCODED_EXPERIENCES } from '@/data/listings'
import { supabase } from '@/lib/supabase'
import { useCallback, useEffect, useRef, useState } from 'react'

const LOCAL_KEY = 'docoolture_wishlist_hardcoded'

function getHardcodedLiked(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveHardcodedLiked(ids: Set<string>) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([...ids]))
  } catch {}
}

export function useWishlist() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const profileIdRef = useRef<string | null>(null)

  const loadFromDb = useCallback(async () => {
    const hardcodedLiked = getHardcodedLiked()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setLiked(hardcodedLiked)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (!profile) {
      setLiked(hardcodedLiked)
      return
    }
    profileIdRef.current = profile.id

    const { data: rows, error } = await supabase
      .from('wishlists')
      .select('experience_id')
      .eq('profile_id', profile.id)

    if (error) console.error('[useWishlist] load error:', error)

    const supabaseLiked = new Set(rows?.map((r) => r.experience_id as string) ?? [])
    setLiked(new Set([...supabaseLiked, ...hardcodedLiked]))
  }, [])

  useEffect(() => {
    loadFromDb()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') loadFromDb()
      if (event === 'SIGNED_OUT') {
        profileIdRef.current = null
        setLiked(getHardcodedLiked())
      }
    })

    return () => subscription.unsubscribe()
  }, [loadFromDb])

  const isLiked = useCallback((id: string) => liked.has(id), [liked])

  const toggle = useCallback(async (id: string) => {
    const isCurrentlyLiked = liked.has(id)

    setLiked((prev) => {
      const next = new Set(prev)
      isCurrentlyLiked ? next.delete(id) : next.add(id)
      return next
    })

    // Experiencias hardcodeadas (no tienen registro real en Supabase todavía)
    if (id in HARDCODED_EXPERIENCES) {
      const current = getHardcodedLiked()
      isCurrentlyLiked ? current.delete(id) : current.add(id)
      saveHardcodedLiked(current)
      return
    }

    const profileId = profileIdRef.current
    if (!profileId) {
      console.warn('[useWishlist] No profileId — usuario no autenticado')
      return
    }

    if (isCurrentlyLiked) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('profile_id', profileId)
        .eq('experience_id', id)
      if (error) console.error('[useWishlist] delete error:', error)
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert({ profile_id: profileId, experience_id: id })
      if (error) console.error('[useWishlist] insert error:', error)
    }
  }, [liked])

  return { isLiked, toggle }
}
