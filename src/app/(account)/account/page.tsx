'use client'

import { ImageAdd02Icon } from '@/components/Icons'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import Avatar from '@/shared/Avatar'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import Textarea from '@/shared/Textarea'
import { useEffect, useRef, useState } from 'react'

export default function AccountPage() {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    display_name: '',
    gender: '',
    email: '',
    date_of_birth: '',
    city: '',
    phone: '',
    about_me: '',
    avatar_url: '',
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setForm({
          display_name: data.display_name || data.full_name || '',
          gender: data.gender || '',
          email: data.email || user.email || '',
          date_of_birth: data.date_of_birth || '',
          city: data.city || '',
          phone: data.phone || '',
          about_me: data.about_me || '',
          avatar_url: data.avatar_url || '',
        })
      }
    }
    load()
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      setForm((f) => ({ ...f, avatar_url: urlData.publicUrl }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: form.display_name,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth || null,
        city: form.city || null,
        phone: form.phone || null,
        about_me: form.about_me || null,
        avatar_url: form.avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    setSaving(false)
    if (error) {
      setErrorMsg('Error al guardar. Intenta de nuevo.')
    } else {
      setSuccessMsg(t.accountPage['Update information'])
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">{t.accountPage['Account information']}</h1>
      <Divider className="my-8 w-14!" />

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
        <div className="flex shrink-0 items-start">
          <div className="relative flex overflow-hidden rounded-full">
            <Avatar src={form.avatar_url || null} initials={form.display_name?.slice(0, 2).toUpperCase() || 'U'} className="h-32 w-32" />
            <div
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-neutral-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageAdd02Icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{t.accountPage['Change Image']}</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>

        <div className="mt-10 max-w-3xl grow space-y-6 md:mt-0 md:ps-16">
          <Field>
            <Label>{t.accountPage.Name}</Label>
            <Input
              className="mt-1.5"
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
            />
          </Field>

          <Field>
            <Label>{t.accountPage.Gender}</Label>
            <Select
              className="mt-1.5"
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            >
              <option value="">{t.accountPage.Other}</option>
              <option value="male">{t.accountPage.Male}</option>
              <option value="female">{t.accountPage.Female}</option>
              <option value="other">{t.accountPage.Other}</option>
            </Select>
          </Field>

          <Field>
            <Label>{t.accountPage.Email}</Label>
            <Input className="mt-1.5" value={form.email} disabled />
          </Field>

          <Field className="max-w-lg">
            <Label>{t.accountPage['Date of birth']}</Label>
            <Input
              className="mt-1.5"
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
            />
          </Field>

          <Field>
            <Label>{t.accountPage['Addess']}</Label>
            <Input
              className="mt-1.5"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </Field>

          <Field>
            <Label>{t.accountPage['Phone number']}</Label>
            <Input
              className="mt-1.5"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Field>

          <Field>
            <Label>{t.accountPage['About you']}</Label>
            <Textarea
              className="mt-1.5"
              value={form.about_me}
              onChange={(e) => setForm((f) => ({ ...f, about_me: e.target.value }))}
            />
          </Field>

          {successMsg && <p className="text-sm text-green-600">{successMsg} ✓</p>}
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <div className="pt-4">
            <ButtonPrimary type="submit" disabled={saving}>
              {saving ? '...' : t.accountPage['Update information']}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </div>
  )
}
