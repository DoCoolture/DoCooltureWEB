import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const EXPERIENCE_ID = '11111111-1111-1111-1111-111111111111'

export async function POST() {
  const supabase = await createSupabaseServerClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check if experience already exists
  const { data: existing } = await supabase
    .from('experiences')
    .select('id')
    .eq('id', EXPERIENCE_ID)
    .single()

  if (existing) {
    return NextResponse.json({ ok: true, message: 'La experiencia ya existe en Supabase.', id: EXPERIENCE_ID })
  }

  // Get or create host for admin profile
  let hostId: string | null = null

  const { data: existingHost } = await supabase
    .from('hosts')
    .select('id')
    .eq('profile_id', profile.id)
    .single()

  if (existingHost) {
    hostId = existingHost.id
  } else {
    const { data: newHost, error: hostError } = await supabase
      .from('hosts')
      .insert({
        profile_id: profile.id,
        user_id: user.id,
        display_name: 'DoCoolture Gastronomy',
        bio: 'Somos un equipo apasionado por mostrar la República Dominicana auténtica — su cultura, su gente y sus tradiciones.',
        verification_status: 'approved',
        is_verified: true,
        status: 'active',
        is_superhost: true,
        response_rate: 100,
        response_time: 'en menos de una hora',
        years_experience: 1,
        country: 'DO',
        total_listings: 1,
        total_reviews: 0,
        total_bookings: 0,
        average_rating: 5.0,
        total_earnings_usd: 0,
      })
      .select('id')
      .single()

    if (hostError) {
      return NextResponse.json({ error: 'Error creando host: ' + hostError.message }, { status: 500 })
    }
    hostId = newHost!.id
  }

  // Insert experience with fixed UUID
  const { error: expError } = await supabase
    .from('experiences')
    .insert({
      id: EXPERIENCE_ID,
      host_id: hostId,
      title: 'Taste of Dominican Culture',
      handle: 'taste-of-dominican-culture',
      description:
        'Descubre la esencia de la República Dominicana a través de su gastronomía. Un recorrido sensorial que combina historia, tradición y sabor — desde ingredientes taínos hasta influencias africanas y europeas. Cada plato cuenta una historia. Guiado por expertos locales en la Zona Colonial de Santo Domingo.',
      category: 'Gastronomía',
      duration_time: '3–4 horas',
      languages: ['Español', 'English'],
      max_guests: 8,
      min_guests: 1,
      address: 'Zona Colonial, Santo Domingo',
      city: 'Santo Domingo',
      country: 'DO',
      price_usd: 120,
      featured_image_url: '/images/experiences/taste-dominican/sancocho.jpeg',
      gallery_urls: [
        '/images/experiences/taste-dominican/sancocho.jpeg',
        '/images/experiences/taste-dominican/desayuno.jpeg',
        '/images/experiences/taste-dominican/locrio.jpeg',
        '/images/experiences/taste-dominican/cacao.jpeg',
        '/images/experiences/taste-dominican/chocolate.jpeg',
        '/images/experiences/taste-dominican/cafe.jpeg',
      ],
      available_days: ['Sábados', 'Domingos'],
      latitude: 18.4733,
      longitude: -69.8833,
      is_published: true,
      is_hidden: false,
      total_reviews: 0,
      total_bookings: 0,
      average_rating: 5.0,
      like_count: 0,
      view_count: 0,
    })

  if (expError) {
    return NextResponse.json({ error: 'Error insertando experiencia: ' + expError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, message: '✅ Experiencia creada en Supabase.', id: EXPERIENCE_ID })
}
