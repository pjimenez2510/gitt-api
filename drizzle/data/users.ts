import { user } from 'drizzle/schema'
import { hashPassword } from 'src/common/utils/encrypter'

export const usersSeed: (typeof user.$inferInsert)[] = [
  {
    idNumberTaxId: '123456789',
    fullName: 'Daniel Zhu',
    email: 'ezhu7643@uta.edu.ec',
    passwordHash: hashPassword('123456'),
    userType: 'ADMINISTRATOR',
    status: 'ACTIVE',
  },
]
