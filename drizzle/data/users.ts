import { users } from 'drizzle/schema'
import { hashPassword } from 'src/common/utils/encrypter'

export const usersSeed: (typeof users.$inferInsert)[] = [
  {
    userName: 'admin',
    password: hashPassword('123456'),
  },
]
