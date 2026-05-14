'use client'

import { supabase } from '@/lib/supabase'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useWishlist() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const profileIdRef = useRef<string | null>(null)

  const loadFromDb = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (!profile) return
    profileIdRef.current = profile.id

    const { data: rows, error } = await supabase
      .from('wishlists')
      .select('experience_id')
      .eq('profile_id', profile.id)

    if (error) console.error('[useWishlist] load error:', error)
    if (rows) setLiked(new Set(rows.map((r) => r.experience_id as string)))
  }, [])

  useEffect(() => {
    loadFromDb()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') loadFromDb()
      if (event === 'SIGNED_OUT') {
        profileIdRef.current = null
        setLiked(new Set())
      }
    })

    return () => subscription.unsubscribe()
  }, [loadFromDb])

  const isLiked = useCallback((id: string) => liked.has(id), [liked])

  const toggle = useCallback(async (id: string) => {
    const profileId = profileIdRef.current
    const isCurrentlyLiked = liked.has(id)

    // Optimistic UI update
    setLiked((prev) => {
      const next = new Set(prev)
      isCurrentlyLiked ? next.delete(id) : next.add(id)
      return next
    })

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
