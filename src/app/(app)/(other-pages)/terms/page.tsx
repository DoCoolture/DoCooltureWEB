import { Divider } from '@/shared/divider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio — DoCoolture',
  description: 'Términos y condiciones de uso de la plataforma DoCoolture.',
}

const sections = [
  {
    title: '1. Aceptación de los términos',
    content: `Al acceder y usar DoCoolture, aceptas estar vinculado por estos Términos de Servicio y nuestra Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, no debes usar la plataforma. DoCoolture se reserva el derecho de actualizar estos términos en cualquier momento, notificando a los usuarios con al menos 15 días de anticipación.`,
  },
  {
    title: '2. Descripción del servicio',
    content: `DoCoolture es una plataforma que conecta exploradores con anfitriones locales en la República Dominicana para vivir experiencias culturales auténticas. DoCoolture actúa como intermediario y no es responsable directamente de la prestación de las experiencias ofrecidas por los anfitriones.`,
  },
  {
    title: '3. Cuentas de usuario',
    content: `Para acceder a ciertas funciones debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente de cualquier uso no autorizado. DoCoolture no será responsable por pérdidas derivadas del uso no autorizado de tu cuenta.`,
  },
  {
    title: '4. Reservas y pagos',
    content: `Al realizar una reserva, aceptas pagar el precio indicado más los cargos de procesamiento aplicables (18% del subtotal). Los pagos se procesan de forma segura a través de PayPal. DoCoolture no almacena información de tarjetas de crédito. El precio final incluye todos los impuestos aplicables según la legislación dominicana.`,
  },
  {
    title: '5. Política de cancelación',
    content: `Las cancelaciones realizadas con más de 48 horas de anticipación recibirán un reembolso completo. Las cancelaciones entre 24 y 48 horas recibirán un reembolso del 50%. No se ofrecen reembolsos para cancelaciones con menos de 24 horas de anticipación o en caso de no presentarse. Los anfitriones también pueden cancelar experiencias en casos de fuerza mayor, en cuyo caso se ofrece reembolso completo.`,
  },
  {
    title: '6. Responsabilidades del anfitrión',
    content: `Los anfitriones son responsables de proporcionar la experiencia tal como fue descrita, de garantizar la seguridad de los participantes, de contar con los permisos necesarios, y de cumplir con todas las leyes y regulaciones aplicables en la República Dominicana. DoCoolture puede suspender o eliminar cuentas de anfitriones que incumplan estas responsabilidades.`,
  },
  {
    title: '7. Responsabilidades del explorador',
    content: `Los exploradores son responsables de proporcionar información precisa al realizar reservas, de respetar las normas establecidas por el anfitrión, de llegar puntualmente al punto de encuentro, y de comportarse de manera respetuosa con los anfitriones, otros participantes y el entorno.`,
  },
  {
    title: '8. Contenido de la plataforma',
    content: `Todo el contenido publicado en DoCoolture, incluyendo textos, imágenes y marcas, está protegido por derechos de autor. No está permitido reproducir, distribuir o modificar este contenido sin autorización expresa. Los usuarios conservan los derechos sobre el contenido que publican, pero otorgan a DoCoolture una licencia no exclusiva para usarlo con fines operativos y promocionales.`,
  },
  {
    title: '9. Limitación de responsabilidad',
    content: `DoCoolture no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso de la plataforma o de la participación en experiencias. La responsabilidad máxima de DoCoolture no excederá el monto pagado por la reserva en cuestión.`,
  },
  {
    title: '10. Ley aplicable',
    content: `Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa se resolverá ante los tribunales competentes de Santo Domingo, República Dominicana, salvo acuerdo expreso de las partes para recurrir a mediación o arbitraje.`,
  },
  {
    title: '11. Contacto',
    content: `Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos en: hola@docoolture.com`,
  },
]

export default function TermsPage() {
  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            Términos de Servicio
          </h1>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            Última actualización: mayo 2025
          </p>
          <Divider className="mt-8 w-14!" />
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10">
            Bienvenido a DoCoolture. Estos términos regulan el uso de nuestra plataforma, que conecta
            exploradores con anfitriones locales para vivir experiencias auténticas en la República Dominicana.
            Por favor, léelos detenidamente antes de usar nuestros servicios.
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
