import { getServerT } from '@/lib/locale-server'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import SocialsList from '@/shared/SocialsList'
import Textarea from '@/shared/Textarea'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT()
  return {
    title: t.contact.title,
    description: t.contact.heading,
  }
}

const PageContact = async () => {
  const t = await getServerT()
  const { heading, address, email, phone, socials, form } = t.contact

  const info = [
    { title: address.label, description: address.value },
    { title: email.label, description: email.value },
    { title: phone.label, description: phone.value },
  ]

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl">
        <div className="grid shrink-0 grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">{heading}</h1>
            <div className="mt-10 flex max-w-sm flex-col gap-y-8 sm:mt-20">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-neutral-200">{item.title}</h3>
                  <span className="mt-2 block text-neutral-500 dark:text-neutral-400">{item.description}</span>
                </div>
              ))}
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-neutral-200">{socials}</h3>
                <SocialsList className="mt-2" />
              </div>
            </div>
          </div>
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <Field className="block">
              <Label>{form.name}</Label>
              <Input placeholder={form.namePlaceholder} type="text" className="mt-1" />
            </Field>
            <Field className="block">
              <Label>{form.email}</Label>
              <Input type="email" placeholder={form.emailPlaceholder} className="mt-1" />
            </Field>
            <Field className="block">
              <Label>{form.message}</Label>
              <Textarea className="mt-1" rows={6} />
            </Field>
            <div>
              <ButtonPrimary type="submit">{form.submit}</ButtonPrimary>
            </div>
          </form>
        </div>
      </div>

      <div className="container mt-20 lg:mt-32">
        <Divider />
      </div>
    </div>
  )
}

export default PageContact
