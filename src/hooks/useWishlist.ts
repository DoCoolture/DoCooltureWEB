'use client'

import { supabase } from '@/lib/supabase'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useWishlist() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const profileIdRef = useRef<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) return
      profileIdRef.current = profile.id

      const { data: rows } = await supabase
        .from('wishlists')
        .select('experience_id')
        .eq('profile_id', profile.id)

      if (rows) setLiked(new Set(rows.map((r) => r.experience_id as string)))
    }

    load()
  }, [])

  const isLiked = useCallback((id: string) => liked.has(id), [liked])

  const toggle = useCallback(async (id: string) => {
    const profileId = profileIdRef.current
    const isCurrentlyLiked = liked.has(id)

    // Optimistic update
    setLiked((prev) => {
      const next = new Set(prev)
      isCurrentlyLiked ? next.delete(id) : next.add(id)
      return next
    })

    if (!profileId) return

    if (isCurrentlyLiked) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('profile_id', profileId)
        .eq('experience_id', id)
    } else {
      await supabase
        .from('wishlists')
        .insert({ profile_id: profileId, experience_id: id })
    }
  }, [liked])

  return { isLiked, toggle }
}
