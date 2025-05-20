import { color } from 'drizzle/schema/tables/inventory/color'

export const colorsSeed: (typeof color.$inferInsert)[] = [
  {
    name: 'Rojo',
    hexCode: '#FF0000',
    description: 'Rojo',
    active: true,
  },
  {
    name: 'Azul',
    hexCode: '#0000FF',
    description: 'Azul',
    active: true,
  },
  {
    name: 'Verde',
    hexCode: '#00FF00',
    description: 'Verde',
    active: true,
  },
  {
    name: 'Amarillo',
    hexCode: '#FFFF00',
    description: 'Amarillo',
    active: true,
  },
  {
    name: 'Blanco',
    hexCode: '#FFFFFF',
    description: 'Blanco',
    active: true,
  },
  {
    name: 'Negro',
    hexCode: '#000000',
    description: 'Negro',
    active: true,
  },
  {
    name: 'Gris',
    hexCode: '#808080',
    description: 'Gris',
    active: true,
  },
  {
    name: 'Naranja',
    hexCode: '#FFA500',
    description: 'Naranja',
    active: true,
  },
  {
    name: 'Morado',
    hexCode: '#800080',
    description: 'Morado',
    active: true,
  },
  {
    name: 'Café',
    hexCode: '#A52A2A',
    description: 'Café',
    active: true,
  },
]
