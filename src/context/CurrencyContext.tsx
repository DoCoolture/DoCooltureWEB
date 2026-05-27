'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Currency = 'USD' | 'DOP' | 'EUR' | 'COP' | 'ARS'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (usdAmount: number) => string
  symbol: string
  isLoading: boolean
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  DOP: 'RD$',
  EUR: '€',
  COP: 'COP$',
  ARS: 'AR$',
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  convertPrice: (amount) => `$${amount}`,
  symbol: '$',
  isLoading: false,
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 })
  const [isLoading, setIsLoading] = useState(false)

  // Al montar, leer cookie guardada
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dc_currency='))
    if (cookie) {
      const value = cookie.split('=')[1] as Currency
      if (['USD', 'DOP', 'EUR', 'COP', 'ARS'].includes(value)) {
        setCurrencyState(value)
      }
    }
  }, [])

  // Fetch tasas de cambio reales cuando cambia la moneda
  useEffect(() => {
    const fetchRates = async () => {
      if (currency === 'USD') {
        setRates({ USD: 1 })
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch('/api/exchange-rates')
        const data = await res.json()
        if (res.ok) {
          setRates(data)
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
        // Tasas aproximadas como fallback si falla la API
        setRates({
          USD: 1,
          DOP: 59.0,
          EUR: 0.92,
          COP: 4000,
          ARS: 900,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()
  }, [currency])

  const setCurrency = (newCurrency: Currency) => {
    // Guardar en cookie por 1 año
    document.cookie = `dc_currency=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`
    setCurrencyState(newCurrency)
  }

  const convertPrice = (usdAmount: number): string => {
    const rate = rates[currency] || 1
    const converted = usdAmount * rate
    const symbol = currencySymbols[currency]

    if (currency === 'DOP' || currency === 'COP' || currency === 'ARS') {
      return `${symbol}${Math.round(converted).toLocaleString()}`
    }
    return `${symbol}${converted.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        symbol: currencySymbols[currency],
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
