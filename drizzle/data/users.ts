import { person } from 'drizzle/schema/tables/users/person'
import { user } from 'drizzle/schema/tables/users/user'
import { hashPassword } from 'src/common/utils/encrypter'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

export const peopleSeed: (typeof person.$inferInsert)[] = [
  {
    dni: '0707047643',
    firstName: 'Daniel',
    lastName: 'Zhu',
    email: 'ezhu7643@uta.edu.ec',
    birthDate: new Date('2003-09-24').toISOString(),
  },
]

export const usersSeed: (typeof user.$inferInsert)[] = [
  {
    personId: 1,
    userName: 'ezhu7643',
    passwordHash: hashPassword('123456'),
    userType: USER_TYPE.ADMINISTRATOR,
    status: USER_STATUS.ACTIVE,
  },
]
