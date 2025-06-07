import { Logger } from '@nestjs/common'

/**
 * Parsea un valor decimal desde una cadena
 * @param valueStr Cadena que representa un valor decimal
 * @returns Valor decimal como cadena
 */
export const parseDecimal = (valueStr: string | null): string => {
  if (!valueStr) return '0'
  const cleaned = String(valueStr)
    .replace(/[$#]/g, '')
    .replace(/ /g, '')
    .replace(',', '.')
  return cleaned
}

/**
 * Parsea un entero desde una cadena
 * @param valueStr Cadena que representa un valor entero
 * @param defaultValue Valor por defecto si no se puede parsear
 * @returns Entero o valor por defecto
 */
export const parseInt = (
  valueStr: string | null,
  defaultValue: number | null = null,
): number | null => {
  if (!valueStr) return defaultValue

  try {
    const parsed = Number.parseInt(valueStr.trim())
    return isNaN(parsed) ? defaultValue : parsed
  } catch (e) {
    Logger.warn(`Error parseando entero: ${valueStr} ${e}`)
    return defaultValue
  }
}

/**
 * Parsea un valor booleano desde varias posibles representaciones
 * @param value Valor a parsear
 * @returns True o False según el valor
 */
export const parseBoolean = (value: string | null): boolean => {
  if (!value) return false

  const truthy = ['S', 'SI', 'Y', 'YES', 'TRUE', '1']
  return truthy.includes(value.trim().toUpperCase())
}
