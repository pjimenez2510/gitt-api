import { Logger } from '@nestjs/common'
import { user } from 'drizzle/schema/tables/users/user'
import { person } from 'drizzle/schema/tables/users/person'
import { UserRecord } from '../types'
import { getDbConnection } from '../utils/db'
import { hashPassword } from '../utils/security'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'
import { eq } from 'drizzle-orm'

const db = getDbConnection()

/**
 * Busca o crea un usuario administrador para el registro de ítems
 * @returns Usuario administrador o null si hay un error
 */
export const findAdminUser = async (): Promise<UserRecord | null> => {
  try {
    const users = await db.select().from(user).limit(1)

    if (users.length > 0) {
      return users[0]
    }

    Logger.warn(
      'No se encontró ningún usuario para asignar como registrador. Creando usuario por defecto.',
    )

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

/**
 * Busca o crea un usuario/custodio por cédula y nombre
 * @param documentId Cédula/RUC del custodio
 * @param fullName Nombre completo del custodio
 * @returns Usuario encontrado o creado, o null si hay error
 */
export const findOrCreateUser = async (
  documentId: string | null,
  fullName: string | null,
): Promise<UserRecord | null> => {
  try {
    if (!documentId || !fullName) {
      return null
    }

    const dni =
      documentId && documentId.trim() !== ''
        ? documentId.trim()
        : `9999${Date.now()}`

    const name =
      fullName && fullName.trim() !== ''
        ? fullName.trim()
        : 'Custodio Desconocido'
    const [firstName, ...lastParts] = name.split(' ')
    const lastName = lastParts.length > 0 ? lastParts.join(' ') : 'Desconocido'

    let personRecord = await db
      .select()
      .from(person)
      .where(eq(person.dni, dni))
      .limit(1)

    if (personRecord.length === 0) {
      const newPerson = await db
        .insert(person)
        .values({
          dni,
          firstName,
          lastName,
          email: `${dni}@custodio.local`,
        })
        .returning()
      personRecord = newPerson
    }

    let userRecord = await db
      .select()
      .from(user)
      .where(eq(user.personId, personRecord[0].id))
      .limit(1)

    if (userRecord.length === 0) {
      const newUser = await db
        .insert(user)
        .values({
          userName: `custodio_${dni}`,
          passwordHash: hashPassword('123456'),
          userType: USER_TYPE.MANAGER,
          personId: personRecord[0].id,
          career: 'CUSTODIAN',
          status: USER_STATUS.ACTIVE,
        })
        .returning()
      userRecord = newUser
    }

    return userRecord[0]
  } catch (error) {
    Logger.error(
      `Error al buscar/crear usuario custodio: ${(error as Error).message}`,
    )
    return null
  }
}
