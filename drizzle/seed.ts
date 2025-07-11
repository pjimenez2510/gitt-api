import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { peopleSeed, usersSeed } from './data/users'
import { Logger } from '@nestjs/common'
import { categoriesSeed } from './data/categories'
import { colorsSeed } from './data/colors'
import { conditionsSeed } from './data/conditions'
import { itemTypesSeed } from './data/item-types'
import { materialsSeed } from './data/materials'
import { statesSeed } from './data/states'
import {
  category,
  color,
  condition,
  itemType,
  material,
  status,
} from './schema/tables/inventory'
import { person, user } from './schema/tables/users'
import { notificationsTemplateSeed } from './data/notifications-template'
import { notificationTemplate } from './schema'

const db = drizzle(process.env.DATABASE_URL ?? '')

async function main() {
  await db.insert(person).values(peopleSeed)
  await db.insert(user).values(usersSeed)
  await db.insert(status).values(statesSeed)
  await db.insert(itemType).values(itemTypesSeed)
  await db.insert(material).values(materialsSeed)
  await db.insert(category).values(categoriesSeed)
  await db.insert(color).values(colorsSeed)
  await db.insert(condition).values(conditionsSeed)
  await db.insert(notificationTemplate).values(notificationsTemplateSeed)
}

main()
  .then(() => {
    Logger.log('Seeding completed successfully')
  })
  .catch((e) => {
    Logger.error(e)
    process.exit(1)
  })
