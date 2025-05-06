import { condition } from 'drizzle/schema/tables/inventory/condition'

export const conditionsSeed: (typeof condition.$inferInsert)[] = [
  {
    name: 'Bueno',
    description: 'Bueno',
    requiresMaintenance: false,
  },
  {
    name: 'Malo',
    description: 'Malo',
    requiresMaintenance: true,
  },
  {
    name: 'Muy Malo',
    description: 'Muy Malo',
    requiresMaintenance: true,
  },
]
