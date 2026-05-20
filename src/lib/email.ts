import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM ?? 'DoCoolture <reservas@docoolture.com>'

interface BookingEmailData {
  hostEmail: string
  hostName: string
  tourName: string
  bookingDate: string
  guests: number
  customerName: string
  customerEmail: string
  totalAmount: number
  currency: string
}

export async function sendBookingNotificationEmail(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) return

  const resend = new Resend(process.env.RESEND_API_KEY)

  const formattedDate = new Date(data.bookingDate).toLocaleDateString('es-DO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background:#1a1a2e;padding:32px 40px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">DoCoolture</h1>
      <p style="color:#9ca3af;margin:6px 0 0;font-size:13px;">República Dominicana</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:24px;">✅</span>
        <div>
          <p style="margin:0;font-weight:700;color:#15803d;font-size:15px;">¡Nueva reserva confirmada!</p>
          <p style="margin:4px 0 0;color:#166534;font-size:13px;">El pago fue procesado exitosamente.</p>
        </div>
      </div>

      <p style="color:#374151;font-size:15px;margin:0 0 24px;">Hola <strong>${data.hostName}</strong>, tienes una nueva reserva en tu experiencia.</p>

      <!-- Booking card -->
      <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:28px;">
        <div style="background:#f9fafb;padding:12px 20px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-weight:600;color:#111827;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Detalle de la reserva</p>
        </div>
        <div style="padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;width:45%;">Experiencia</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${data.tourName}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Fecha</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;">${formattedDate}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Personas</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;">${data.guests} persona${data.guests !== 1 ? 's' : ''}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Total pagado</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;">${data.currency} ${Number(data.totalAmount).toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Customer card -->
      <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:28px;">
        <div style="background:#f9fafb;padding:12px 20px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-weight:600;color:#111827;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Datos del explorador</p>
        </div>
        <div style="padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;width:45%;">Nombre</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;">${data.customerName}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Correo</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;">${data.customerEmail}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="https://docoolture.com/host/dashboard" style="display:inline-block;background:#1a1a2e;color:#ffffff;padding:14px 32px;border-radius:100px;text-decoration:none;font-size:14px;font-weight:600;">
          Ver en mi panel →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">DoCoolture · República Dominicana</p>
      <p style="margin:4px 0 0;color:#9ca3af;font-size:11px;">Este correo se envió automáticamente al confirmar una reserva en tu experiencia.</p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: FROM,
    to: data.hostEmail,
    subject: `✅ Nueva reserva: ${data.tourName}`,
    html,
  })
}
