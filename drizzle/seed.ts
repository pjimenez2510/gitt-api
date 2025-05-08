import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { peopleSeed, usersSeed } from './data/users'
import { Logger } from '@nestjs/common'
import {
  category,
  color,
  condition,
  material,
  person,
  status,
  user,
} from './schema'
import { categoriesSeed } from './data/categories'
import { colorsSeed } from './data/colors'
import { conditionsSeed } from './data/conditions'
import { itemTypesSeed } from './data/item-types'
import { materialsSeed } from './data/materials'
import { statesSeed } from './data/states'
import { itemType } from './schema/tables/inventory'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  await db.insert(person).values(peopleSeed)
  await db.insert(user).values(usersSeed)
  await db.insert(status).values(statesSeed)
  await db.insert(itemType).values(itemTypesSeed)
  await db.insert(material).values(materialsSeed)
  await db.insert(category).values(categoriesSeed)
  await db.insert(color).values(colorsSeed)
  await db.insert(condition).values(conditionsSeed)
}

main()
  .then(() => {
    Logger.log('Seeding completed successfully')
  })
  .catch((e) => {
    Logger.error(e)
    process.exit(1)
  })
