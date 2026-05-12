export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    // OCULTO - No se usa en DoCoolture
    // { id: '1', href: '/', name: 'Stays' },
    // { id: '2', href: '/real-estate', name: 'Real Estate' },
    // { id: '4', href: '/car', name: 'Car rentals' },
    // { id: '5', href: '/', name: 'Templates', type: 'mega-menu', children: [...] },

    // ✅ DOCOOLTURE - Menú principal
    { id: '3', href: '/experience', name: 'Experiences' },
    { id: '6', href: '/about', name: 'About' },
    { id: '7', href: '/contact', name: 'Contact' },

    // ✅ DOCOOLTURE - Dropdown "Exploradores" (reemplaza "Travelers")
    {
      id: '8',
      href: '/experience',
      name: 'Exploradores',
      type: 'dropdown',
      children: [
        { id: '8-1', href: '/experience', name: 'Experiencias' },
        { id: '8-2', href: '/talento', name: 'Talento' },
        // OCULTO - opciones originales
        // { id: '1', href: '/', name: 'Stays' },
        // { id: '2', href: '/real-estate', name: 'Real Estate' },
        // { id: '4', href: '/car', name: 'Car rentals' },
        // { id: '5', href: '/flight-categories/all', name: 'Flights' },
      ],
    },
  ]
}

export async function getNavMegaMenu(): Promise<TNavigationItem> {
  const navigation = await getNavigation()
  return navigation.find((item) => item.type === 'mega-menu' && item.name === 'Templates') || {}
}

export type TNavigationItem = Partial<{
  id: string
  href: string
  name: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
}>

// ✅ DOCOOLTURE - Idiomas (Español, Inglés, Francés)
export const getLanguages = async () => {
  return [
    {
      id: 'Spanish',
      name: 'Español',
      description: 'República Dominicana',
      href: '#',
      active: true,
    },
    {
      id: 'English',
      name: 'English',
      description: 'United States',
      href: '#',
    },
    {
      id: 'French',
      name: 'Français',
      description: 'France',
      href: '#',
    },
    {
      id: 'Italian',
      name: 'Italiano',
      description: 'Italia',
      href: '#',
    },
    // OCULTO - idiomas originales no relevantes
    // { id: 'Vietnamese', name: 'Vietnamese', description: 'Vietnamese', href: '#' },
    // { id: 'Francais', name: 'Francais', description: 'Belgique', href: '#' },
    // { id: 'Francais', name: 'Francais', description: 'Canada', href: '#' },
  ]
}

// ✅ DOCOOLTURE - Monedas (DOP, USD, COP, ARS, EUR)
export const getCurrencies = async () => {
  return [
    {
      id: 'DOP',
      name: 'DOP',
      href: '#',
      active: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    {
      id: 'USD',
      name: 'USD',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    {
      id: 'EUR',
      name: 'EUR',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M15 14.4923C14.5216 15.3957 13.6512 16 12.6568 16C11.147 16 9.92308 14.6071 9.92308 12.8889V11.1111C9.92308 9.39289 11.147 8 12.6568 8C13.6512 8 14.5216 8.60426 15 9.50774M9 12H12.9231" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    {
      id: 'COP',
      name: 'COP',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M15 14.4923C14.5216 15.3957 13.6512 16 12.6568 16C11.147 16 9.92308 14.6071 9.92308 12.8889V11.1111C9.92308 9.39289 11.147 8 12.6568 8C13.6512 8 14.5216 8.60426 15 9.50774M9 12H12.9231" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    {
      id: 'ARS',
      name: 'ARS',
      href: '#',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M9 12H13.2M9 12V9.2963C9 8.82489 9 8.58919 9.14645 8.44274C9.29289 8.2963 9.5286 8.2963 10 8.2963H13.2C14.1941 8.2963 15 9.1254 15 10.1481C15 11.1709 14.1941 12 13.2 12M9 12V14.7037C9 15.1751 9 15.4108 9.14645 15.5572C9.29289 15.7037 9.5286 15.7037 10 15.7037H13.2C14.1941 15.7037 15 14.8746 15 13.8518C15 12.8291 14.1941 12 13.2 12M10.4938 8.2963V7M10.4938 17V15.7037M12.8982 8.2963V7M12.8982 17V15.7037" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
</svg>`,
    },
    // OCULTO - monedas originales no relevantes para DoCoolture
    // { id: 'GBF', name: 'GBF', href: '#', icon: '...' },
    // { id: 'SAR', name: 'SAR', href: '#', icon: '...' },
    // { id: 'QAR', name: 'QAR', href: '#', icon: '...' },
    // { id: 'BAD', name: 'BAD', href: '#', icon: '...' },
  ]
}

export const getHeaderDropdownCategories = async () => {
  return []
}