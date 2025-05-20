import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'

/**
 * Configuración de la conexión a la base de datos
 * @returns Instancia de drizzle
 */
export const getDbConnection = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('La variable de entorno DATABASE_URL no está definida')
  }
  return drizzle(process.env.DATABASE_URL)
}
