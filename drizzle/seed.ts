import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { usersTable } from './schema'
import { usersSeed } from './data/users'
import { Logger } from '@nestjs/common'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  await db.insert(usersTable).values(usersSeed)
}

main()
  .then(() => {
    Logger.log('Seeding completed successfully')
  })
  .catch((e) => {
    Logger.error(e)
    process.exit(1)
  })
