import { category } from 'drizzle/schema'

export const categoriesSeed: (typeof category.$inferInsert)[] = [
  {
    name: 'Electrónicos',
    code: 'ELE',
    depreciationPercentage: '0.2',
    standardUsefulLife: 5,
    description: 'Electrónicos',
    parentCategoryId: null,
    active: true,
  },
  {
    name: 'Muebles',
    code: 'MUE',
    depreciationPercentage: '0.1',
    standardUsefulLife: 10,
    description: 'Muebles',
    parentCategoryId: null,
    active: true,
  },
  {
    name: 'Equipos de computación',
    code: 'EQU',
    depreciationPercentage: '0.1',
    standardUsefulLife: 10,
    description: 'Equipos de computación',
    parentCategoryId: null,
    active: true,
  },
]
