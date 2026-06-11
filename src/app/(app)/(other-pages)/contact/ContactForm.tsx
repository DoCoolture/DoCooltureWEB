'use client'

import { sendContactMessage } from '@/app/actions/contact'
import { useLanguage } from '@/context/LanguageContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { useActionState } from 'react'

export default function ContactForm() {
  const { t } = useLanguage()
  const { form } = t.contact
  const [state, action, pending] = useActionState(sendContactMessage, null)

  if (state?.success) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-8 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
        {form.success}
      </div>
    )
  }

  return (
    <form className="grid grid-cols-1 gap-6" action={action}>
      <Field className="block">
        <Label>{form.name}</Label>
        <Input name="name" placeholder={form.namePlaceholder} type="text" className="mt-1" required />
      </Field>
      <Field className="block">
        <Label>{form.email}</Label>
        <Input name="email" type="email" placeholder={form.emailPlaceholder} className="mt-1" required />
      </Field>
      <Field className="block">
        <Label>{form.message}</Label>
        <Textarea name="message" className="mt-1" rows={6} required />
      </Field>
      {state?.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {form.error}
        </p>
      )}
      <div>
        <ButtonPrimary type="submit" disabled={pending}>
          {pending ? '...' : form.submit}
        </ButtonPrimary>
      </div>
    </form>
  )
}
