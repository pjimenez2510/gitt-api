import { material } from 'drizzle/schema/tables/inventory/material'

export const materialsSeed: (typeof material.$inferInsert)[] = [
  {
    name: 'Acero',
    description: 'Acero',
    materialType: 'Metal',
  },
  {
    name: 'Plástico',
    description: 'Plástico',
    materialType: 'Plástico',
  },
  {
    name: 'Madera',
    description: 'Madera',
    materialType: 'Madera',
  },
  {
    name: 'Hierro',
    description: 'Hierro',
    materialType: 'Metal',
  },
  {
    name: 'Aluminio',
    description: 'Aluminio',
    materialType: 'Metal',
  },
  {
    name: 'Cobre',
    description: 'Cobre',
    materialType: 'Metal',
  },
  {
    name: 'Bronce',
    description: 'Bronce',
    materialType: 'Metal',
  },
  {
    name: 'Zinc',
    description: 'Zinc',
    materialType: 'Metal',
  },
  {
    name: 'Níquel',
    description: 'Níquel',
    materialType: 'Metal',
  },
  {
    name: 'Plata',
    description: 'Plata',
    materialType: 'Metal',
  },
  {
    name: 'Oro',
    description: 'Oro',
    materialType: 'Metal',
  },
]
