import { itemType } from 'drizzle/schema/tables/inventory/itemType'

export const itemTypesSeed: (typeof itemType.$inferInsert)[] = [
  {
    code: 'BCA',
    name: 'Bienes sujetos a control',
    description:
      'Bienes que requieren control de inventario y no superan los 100 dólares',
  },
  {
    code: 'BLD',
    name: 'Bienes de lujo',
    description: 'Bienes que superan los 100 dólares',
  },
]
