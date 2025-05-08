import { Logger } from '@nestjs/common'

/**
 * Parsea una fecha desde diferentes formatos a un formato ISO estándar
 * @param dateStr Cadena de fecha en varios posibles formatos
 * @returns Fecha en formato ISO o null si no es válida
 */
export const parseDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null

  // Intentar diferentes formatos de fecha
  try {
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/')
      if (parts[0].length <= 2) {
        // DD/MM/YYYY
        const [day, month, year] = parts.map(Number)
        return new Date(year, month - 1, day).toISOString().split('T')[0]
      } else {
        // YYYY/MM/DD
        const [year, month, day] = parts.map(Number)
        return new Date(year, month - 1, day).toISOString().split('T')[0]
      }
    } else if (dateStr.includes('-')) {
      // Ya está en formato YYYY-MM-DD
      return dateStr
    }

    // Fallback: intentar parsear como fecha directamente
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch (e) {
    Logger.warn(`Error parseando fecha: ${dateStr} ${e}`)
  }

  return null
}
