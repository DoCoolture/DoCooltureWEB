'use client'

import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { useState } from 'react'

export default function AccountPasswordPage() {
  const { t } = useLanguage()
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (newPass !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }
    if (newPass.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setSaving(true)

    // Re-authenticate to verify current password
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) { setErrorMsg('No se pudo verificar tu sesión.'); setSaving(false); return }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    })

    if (signInError) {
      setErrorMsg('La contraseña actual es incorrecta.')
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPass })
    setSaving(false)

    if (error) {
      setErrorMsg('Error al actualizar la contraseña. Intenta de nuevo.')
    } else {
      setSuccessMsg('Contraseña actualizada correctamente.')
      setCurrent('')
      setNewPass('')
      setConfirm('')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">{t.accountPage['Update your password']}</h1>
      <Divider className="my-8 w-14!" />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <Field>
          <Label>{t.accountPage['Current password']}</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Label>{t.accountPage['New password']}</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Label>{t.accountPage['Confirm password']}</Label>
          <Input
            type="password"
            className="mt-1.5"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>

        {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

        <div className="pt-4">
          <ButtonPrimary type="submit" disabled={saving}>
            {saving ? '...' : t.accountPage['Update password']}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  )
}
