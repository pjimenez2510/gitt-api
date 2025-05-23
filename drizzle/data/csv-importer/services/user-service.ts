import { Logger } from '@nestjs/common'
import { user } from 'drizzle/schema/tables/users/user'
import { person } from 'drizzle/schema/tables/users/person'
import { UserRecord } from '../types'
import { getDbConnection } from '../utils/db'
import { hashPassword } from '../utils/security'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

const db = getDbConnection()

/**
 * Busca o crea un usuario administrador para el registro de ítems
 * @returns Usuario administrador o null si hay un error
 */
export const findAdminUser = async (): Promise<UserRecord | null> => {
  try {
    // Buscar un usuario existente
    const users = await db.select().from(user).limit(1)

    if (users.length > 0) {
      return users[0]
    }

    // Si no hay usuarios, crear uno por defecto
    Logger.warn(
      'No se encontró ningún usuario para asignar como registrador. Creando usuario por defecto.',
    )

    // Primero crear una persona
    const newPerson = await db
      .insert(person)
      .values({
        dni: '9999999999',
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@sistema.local',
      })
      .returning()

    if (newPerson.length === 0) {
      throw new Error('No se pudo crear la persona para el usuario por defecto')
    }

    // Luego crear el usuario
    const newUser = await db
      .insert(user)
      .values({
        userName: 'admin',
        passwordHash: hashPassword('123456'),
        userType: USER_TYPE.ADMINISTRATOR,
        personId: newPerson[0].id,
        career: 'ADMINISTRATOR',
        status: USER_STATUS.ACTIVE,
      })
      .returning()

    if (newUser.length === 0) {
      throw new Error('No se pudo crear el usuario por defecto')
    }

    return newUser[0]
  } catch (error) {
    Logger.error(
      `Error al buscar/crear usuario administrador: ${(error as Error).message}`,
    )
    return null
  }
}
