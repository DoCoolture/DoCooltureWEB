import { Divider } from '@/shared/divider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad — DoCoolture',
  description: 'Cómo DoCoolture recopila, usa y protege tu información personal.',
}

const sections = [
  {
    title: '1. Información que recopilamos',
    content: `Recopilamos información que nos proporcionas directamente al crear una cuenta (nombre, email, teléfono, ciudad), al realizar reservas (datos de pago procesados por PayPal), y al publicar experiencias como anfitrión. También recopilamos automáticamente datos de uso como páginas visitadas, tiempo en la plataforma y dirección IP para mejorar nuestros servicios.`,
  },
  {
    title: '2. Cómo usamos tu información',
    content: `Usamos tu información para operar y mejorar la plataforma, procesar reservas y pagos, enviarte confirmaciones y notificaciones relacionadas con tus reservas, personalizar tu experiencia, y cumplir con nuestras obligaciones legales. No usamos tu información para publicidad de terceros sin tu consentimiento explícito.`,
  },
  {
    title: '3. Compartir información',
    content: `Compartimos información limitada entre exploradores y anfitriones para facilitar las reservas (por ejemplo, tu nombre y detalles de contacto al confirmar una experiencia). No vendemos tu información a terceros. Podemos compartir datos con proveedores de servicios como PayPal (pagos) y Supabase (infraestructura), quienes están contractualmente obligados a protegerla.`,
  },
  {
    title: '4. Cookies y tecnologías similares',
    content: `Usamos cookies esenciales para mantener tu sesión activa y cookies analíticas para entender cómo se usa la plataforma. Puedes gestionar las cookies desde la configuración de tu navegador. Consulta nuestra Política de Cookies para más detalles.`,
  },
  {
    title: '5. Seguridad de los datos',
    content: `Implementamos medidas técnicas y organizativas para proteger tu información, incluyendo cifrado SSL, almacenamiento seguro en servidores certificados, y acceso restringido a datos personales. Sin embargo, ningún sistema es completamente seguro y no podemos garantizar la seguridad absoluta de tu información.`,
  },
  {
    title: '6. Retención de datos',
    content: `Conservamos tu información mientras tu cuenta esté activa o sea necesaria para prestarte el servicio. Si eliminas tu cuenta, eliminaremos tus datos personales en un plazo de 30 días, salvo que la ley nos obligue a conservarlos por más tiempo (por ejemplo, registros de transacciones).`,
  },
  {
    title: '7. Tus derechos',
    content: `Tienes derecho a acceder a tu información personal, corregir datos inexactos, solicitar la eliminación de tus datos, oponerte al procesamiento de tus datos, y exportar tus datos en formato portable. Para ejercer estos derechos, contáctanos en hola@docoolture.com. Responderemos en un plazo máximo de 30 días.`,
  },
  {
    title: '8. Transferencias internacionales',
    content: `Nuestros servidores están administrados por Supabase (con infraestructura en la nube). Al usar DoCoolture, aceptas que tu información puede ser transferida y procesada fuera de la República Dominicana, siempre bajo las garantías de seguridad descritas en esta política.`,
  },
  {
    title: '9. Menores de edad',
    content: `DoCoolture no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado datos de un menor sin verificación de consentimiento parental, eliminaremos esa información de inmediato.`,
  },
  {
    title: '10. Cambios a esta política',
    content: `Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos por email o mediante un aviso en la plataforma con al menos 15 días de anticipación. El uso continuado de DoCoolture después de los cambios constituye tu aceptación de la nueva política.`,
  },
  {
    title: '11. Contacto',
    content: `Para preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos, contáctanos en: hola@docoolture.com`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            Última actualización: mayo 2025
          </p>
          <Divider className="mt-8 w-14!" />
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10">
            En DoCoolture respetamos tu privacidad y nos comprometemos a proteger tu información personal.
            Esta política explica qué datos recopilamos, cómo los usamos y cuáles son tus derechos.
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  {section.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
