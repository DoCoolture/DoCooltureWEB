'use server'

import { Resend } from 'resend'
import { FROM } from '@/lib/email'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendContactMessage(
  _prev: { success?: boolean; error?: boolean } | null,
  formData: FormData
): Promise<{ success?: boolean; error?: boolean }> {
  const name = String(formData.get('name') ?? '').trim().slice(0, 200)
  const email = String(formData.get('email') ?? '').trim().slice(0, 200)
  const message = String(formData.get('message') ?? '').trim().slice(0, 2000)

  if (!name || !email || !message) return { error: true }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return { error: true }

  const to = process.env.CONTACT_EMAIL ?? 'info@docoolture.com'

  if (!process.env.RESEND_API_KEY) {
    console.warn('[contact] RESEND_API_KEY not set — skipping email send')
    return { success: true }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: FROM,
      to,
      replyTo: email,
      subject: `Mensaje de contacto: ${name}`,
      html: `
<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Mensaje:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `.trim(),
    })
    return { success: true }
  } catch (err) {
    console.error('[contact] send error:', err)
    return { error: true }
  }
}
