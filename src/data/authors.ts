import avatars1 from '@/images/avatars/Image-1.png'

export async function getAuthors() {
  return [
    {
      id: 1,
      displayName: 'Eden Smith',
      handle: 'eden-smith',
      email: 'hola@docoolture.com',
      gender: 'Female',
      avatarUrl: avatars1.src,
      bgImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500',
      count: 1,
      description:
        'Somos un equipo apasionado por mostrar la República Dominicana auténtica — su cultura, su gente y sus tradiciones.',
      jobName: 'Cultural Guide',
      starRating: 5.0,
      reviews: 12,
      location: 'Santo Domingo, RD',
    },
  ]
}

export async function getAuthorByHandle(handle: string) {
  const authors = await getAuthors()
  const author = authors.find((a) => a.handle === handle) ?? authors[0]

  return {
    ...author,
    address: 'Santo Domingo, República Dominicana',
    phone: '+1 (809) 555-0100',
    languages: 'Español, English',
    joinedDate: 'Enero 2025',
    reviewsCount: 12,
  }
}

export type TAuthor = Awaited<ReturnType<typeof getAuthors>>[number]
