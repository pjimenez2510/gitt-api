import { person, user } from 'drizzle/schema'
import { hashPassword } from 'src/common/utils/encrypter'

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
    username: 'ezhu7643',
    passwordHash: hashPassword('123456'),
    userType: 'ADMINISTRATOR',
    status: 'ACTIVE',
  },
]
