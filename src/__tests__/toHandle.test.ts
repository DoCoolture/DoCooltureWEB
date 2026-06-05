import { describe, it, expect } from 'vitest'
import { toHandle } from '@/data/hosts'

describe('toHandle', () => {
  it('convierte espacios a guiones', () => {
    expect(toHandle('Carlos Ramirez')).toBe('carlos-ramirez')
  })

  it('convierte todo a minúsculas', () => {
    expect(toHandle('JUAN JOSE')).toBe('juan-jose')
  })

  it('colapsa múltiples espacios en un solo guión', () => {
    expect(toHandle('Juan  Jose  Garcia')).toBe('juan-jose-garcia')
  })

  it('maneja una sola palabra', () => {
    expect(toHandle('Carlos')).toBe('carlos')
  })

  it('es reversible para nombres simples', () => {
    const name = 'Maria Lopez'
    const handle = toHandle(name)
    expect(handle.replace(/-/g, ' ')).toBe(name.toLowerCase())
  })

  it('maneja tabs y saltos de línea como espacios', () => {
    expect(toHandle('Juan\tJose')).toBe('juan-jose')
  })

  it('elimina tildes: á é í ó ú', () => {
    expect(toHandle('Álvaro Pérez')).toBe('alvaro-perez')
    expect(toHandle('José García')).toBe('jose-garcia')
    expect(toHandle('María López')).toBe('maria-lopez')
  })

  it('elimina la tilde de ñ → n', () => {
    expect(toHandle('Ángel Muñoz')).toBe('angel-munoz')
  })

  it('maneja nombres dominicanos reales', () => {
    expect(toHandle('Yésica Peña')).toBe('yesica-pena')
    expect(toHandle('Ramón Díaz')).toBe('ramon-diaz')
    expect(toHandle('Núñez')).toBe('nunez')
  })

  it('el handle de un nombre con tilde coincide con el mismo nombre sin tilde', () => {
    expect(toHandle('María')).toBe(toHandle('Maria'))
    expect(toHandle('José')).toBe(toHandle('Jose'))
  })
})
