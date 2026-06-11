'use client'

import { supabase } from '@/lib/supabase'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useWishlist() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const profileIdRef = useRef<string | null>(null)
  const processingRef = useRef<Set<string>>(new Set())

  const loadFromDb = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLiked(new Set())
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      setLiked(new Set())
      return
    }
    profileIdRef.current = profile.id

    const { data: rows, error } = await supabase
      .from('wishlists')
      .select('experience_id')
      .eq('profile_id', profile.id)

    if (error) console.error('[useWishlist] load error:', error)

    setLiked(new Set(rows?.map((r) => r.experience_id as string) ?? []))
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
    if (processingRef.current.has(id)) return
    processingRef.current.add(id)

    const isCurrentlyLiked = liked.has(id)

    setLiked((prev) => {
      const next = new Set(prev)
      isCurrentlyLiked ? next.delete(id) : next.add(id)
      return next
    })

    const profileId = profileIdRef.current
    if (!profileId) {
      console.warn('[useWishlist] No profileId — usuario no autenticado')
      setLiked((prev) => {
        const next = new Set(prev)
        isCurrentlyLiked ? next.add(id) : next.delete(id)
        return next
      })
      processingRef.current.delete(id)
      return
    }

    if (isCurrentlyLiked) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('profile_id', profileId)
        .eq('experience_id', id)
      if (error) {
        console.error('[useWishlist] delete error:', error)
        setLiked((prev) => { const next = new Set(prev); next.add(id); return next })
      }
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert({ profile_id: profileId, experience_id: id })
      if (error) {
        console.error('[useWishlist] insert error:', error)
        setLiked((prev) => { const next = new Set(prev); next.delete(id); return next })
      }
    }

    processingRef.current.delete(id)
  }, [liked])

  return { isLiked, toggle }
}
