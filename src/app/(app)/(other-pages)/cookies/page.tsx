import { Divider } from '@/shared/divider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies — DoCoolture',
  description: 'Cómo DoCoolture usa cookies y tecnologías similares.',
}

const cookieTypes = [
  {
    name: 'Cookies esenciales',
    description: 'Necesarias para el funcionamiento básico de la plataforma.',
    examples: 'Sesión de usuario, autenticación, preferencias de idioma.',
    canDisable: 'No — sin estas cookies la plataforma no funciona correctamente.',
  },
  {
    name: 'Cookies de rendimiento',
    description: 'Nos ayudan a entender cómo los usuarios interactúan con la plataforma.',
    examples: 'Páginas visitadas, tiempo de sesión, errores encontrados.',
    canDisable: 'Sí — puedes desactivarlas sin afectar la funcionalidad principal.',
  },
  {
    name: 'Cookies de preferencias',
    description: 'Recuerdan tus configuraciones personales para mejorar tu experiencia.',
    examples: 'Idioma preferido, moneda, modo oscuro/claro.',
    canDisable: 'Sí — si las desactivas, tendrás que reconfigurar tus preferencias cada vez.',
  },
]

const sections = [
  {
    title: '¿Qué son las cookies?',
    content: `Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un periodo de tiempo, para que no tengas que volver a configurarlas cada vez que regreses.`,
  },
  {
    title: '¿Cómo gestionar las cookies?',
    content: `Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad de DoCoolture. A continuación te explicamos cómo hacerlo en los principales navegadores:`,
  },
  {
    title: 'Cookies de terceros',
    content: `DoCoolture utiliza servicios de terceros que pueden establecer sus propias cookies: Supabase (autenticación y base de datos) y PayPal (procesamiento de pagos). Estos servicios tienen sus propias políticas de cookies que te recomendamos revisar. No tenemos control sobre las cookies de terceros.`,
  },
  {
    title: 'Actualizaciones a esta política',
    content: `Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en nuestra tecnología o en la legislación aplicable. Te notificaremos de cualquier cambio significativo. La fecha de última actualización siempre estará visible al inicio de esta página.`,
  },
  {
    title: 'Contacto',
    content: `Si tienes preguntas sobre el uso de cookies en DoCoolture, escríbenos a: hola@docoolture.com`,
  },
]

const browsers = [
  { name: 'Google Chrome', instruction: 'Configuración → Privacidad y seguridad → Cookies y otros datos de sitios' },
  { name: 'Mozilla Firefox', instruction: 'Opciones → Privacidad y seguridad → Cookies y datos del sitio' },
  { name: 'Safari', instruction: 'Preferencias → Privacidad → Gestionar datos de sitios web' },
  { name: 'Microsoft Edge', instruction: 'Configuración → Privacidad, búsqueda y servicios → Cookies' },
]

export default function CookiesPage() {
  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            Política de Cookies
          </h1>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            Última actualización: mayo 2025
          </p>
          <Divider className="mt-8 w-14!" />
        </div>

        <div className="space-y-12">

          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            DoCoolture usa cookies y tecnologías similares para garantizar el correcto funcionamiento
            de la plataforma y mejorar tu experiencia como usuario.
          </p>

          {/* Tipos de cookies */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              Tipos de cookies que usamos
            </h2>
            <div className="space-y-4">
              {cookieTypes.map((cookie) => (
                <div
                  key={cookie.name}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6"
                >
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {cookie.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    {cookie.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-2">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Ejemplos: </span>
                      <span className="text-neutral-500 dark:text-neutral-400">{cookie.examples}</span>
                    </div>
                    <div className={`rounded-xl px-4 py-2 ${cookie.canDisable.startsWith('No') ? 'bg-red-50 dark:bg-red-950' : 'bg-green-50 dark:bg-green-950'}`}>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">¿Puedes desactivarlas? </span>
                      <span className={cookie.canDisable.startsWith('No') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {cookie.canDisable}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secciones de texto */}
          {sections.map((section, i) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {section.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {section.content}
              </p>

              {/* Instrucciones de navegadores */}
              {i === 1 && (
                <div className="mt-5 space-y-3">
                  {browsers.map((b) => (
                    <div key={b.name} className="flex items-start gap-x-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-sm">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 shrink-0">{b.name}:</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{b.instruction}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
