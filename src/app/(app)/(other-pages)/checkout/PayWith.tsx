'use client'

import { Description, Field, Label } from '@/shared/fieldset'
import Textarea from '@/shared/Textarea'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { PaypalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

// ============================================================
// ESTRUCTURA DE PAGOS DOCOOLTURE
// Fase 1: PayPal (activo)
// Fase 2: CardNet (estructura lista, pendiente integración)
// ============================================================

const PaypalForm = () => (
  <div className="flex flex-col gap-y-5">
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950">
      <div className="flex items-center gap-x-3">
        <HugeiconsIcon icon={PaypalIcon} size={32} strokeWidth={1.5} className="text-blue-600" />
        <div>
          <p className="font-semibold text-blue-900 dark:text-blue-100">Pago seguro con PayPal</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Serás redirigido a PayPal para completar tu pago de forma segura.
          </p>
        </div>
      </div>
    </div>

    <Field>
      <Label>Correo electrónico de PayPal</Label>
      <input
        name="paypal-email"
        type="email"
        placeholder="tu@email.com"
        className="mt-1.5 block w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800"
      />
    </Field>

    <Field>
      <Label>Mensaje para el anfitrión (opcional)</Label>
      <Textarea
        name="message"
        className="mt-1.5"
        placeholder="¿Tienes alguna pregunta o necesidad especial para tu experiencia?"
      />
      <Description>El anfitrión recibirá este mensaje con tu reserva.</Description>
    </Field>

    <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
      🔒 Tu pago está protegido por PayPal. No almacenamos datos de tu cuenta.
    </div>
  </div>
)

// ESTRUCTURA LISTA PARA CARDNET - Fase 2
// const CardNetForm = () => (
//   <div className="flex flex-col gap-y-5">
//     <div className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-500">
//       CardNet — Integración pendiente (Fase 2)
//     </div>
//     <Field>
//       <Label>Número de tarjeta</Label>
//       <Input name="card-number" className="mt-1.5" placeholder="0000 0000 0000 0000" />
//     </Field>
//     <Field>
//       <Label>Nombre en la tarjeta</Label>
//       <Input name="card-holder" className="mt-1.5" placeholder="NOMBRE APELLIDO" />
//     </Field>
//     <div className="flex gap-x-5">
//       <Field>
//         <Label>Vencimiento</Label>
//         <Input name="expiration-date" className="mt-1.5" placeholder="MM/AA" />
//       </Field>
//       <Field>
//         <Label>CVC</Label>
//         <Input name="CVC" className="mt-1.5" placeholder="000" />
//       </Field>
//     </div>
//   </div>
// )

const PayWith = () => {
  const [paymentMethod, setPaymentMethod] = React.useState('paypal')

  return (
    <div className="pt-5">
      <h3 className="text-2xl font-semibold">Método de pago</h3>
      <div className="my-5 w-14 border-b border-neutral-200 dark:border-neutral-700" />

      <TabGroup
        className="mt-6"
        onChange={(index) => {
          setPaymentMethod(index === 0 ? 'paypal' : 'cardnet')
        }}
      >
        <TabList className="my-5 flex gap-1 text-sm">
          <Tab className="flex items-center gap-x-2 rounded-full px-4 py-2.5 font-medium leading-none data-hover:bg-black/5 data-[selected]:bg-neutral-900 data-[selected]:text-white sm:px-6 dark:data-[selected]:bg-neutral-100 dark:data-[selected]:text-neutral-900">
            PayPal
            <HugeiconsIcon icon={PaypalIcon} size={20} strokeWidth={1.5} />
          </Tab>
          {/* CardNet — Fase 2 (deshabilitado temporalmente) */}
          <Tab
            disabled
            className="flex cursor-not-allowed items-center gap-x-2 rounded-full px-4 py-2.5 font-medium leading-none opacity-40 sm:px-6"
          >
            CardNet
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
              Próximamente
            </span>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel className="flex flex-col gap-y-5">
            <PaypalForm />
          </TabPanel>
          {/* Fase 2 — CardNet */}
          <TabPanel className="flex flex-col gap-y-5">
            <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-neutral-500">
              <p className="font-medium">CardNet estará disponible próximamente</p>
              <p className="mt-1 text-sm">Por favor usa PayPal para completar tu reserva.</p>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <input type="hidden" name="paymentMethod" value={paymentMethod} />
    </div>
  )
}

export default PayWith