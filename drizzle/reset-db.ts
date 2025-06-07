import { Logger } from '@nestjs/common'
import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

const db = drizzle(process.env.DATABASE_URL ?? '')

const main = async () => {
  try {
    await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`)
  } catch (error) {
    Logger.error(error)
  }
}

void main()
