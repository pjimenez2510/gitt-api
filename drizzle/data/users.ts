import { usersTable } from 'drizzle/schema'
import { hashPassword } from 'src/common/utils/encrypter'

export const usersSeed: (typeof usersTable.$inferInsert)[] = [
  {
    userName: 'admin',
    password: hashPassword('123456'),
  },
]
