import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { usersSeed } from './data/users'
import { Logger } from '@nestjs/common'
import { user } from './schema'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  // await db.insert(user).values(usersSeed)
}

main()
  .then(() => {
    Logger.log('Seeding completed successfully')
  })
  .catch((e) => {
    Logger.error(e)
    process.exit(1)
  })
