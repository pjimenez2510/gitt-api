import { status } from 'drizzle/schema/tables/inventory/status'

export const statesSeed: (typeof status.$inferInsert)[] = [
  {
    name: 'Activo',
    description: 'Activo',
    active: false,
  },
  {
    name: 'En reparación',
    description: 'En reparación',
    active: true,
  },
  {
    name: 'En servicio',
    description: 'En servicio',
    active: true,
  },
  {
    name: 'En préstamo',
    description: 'En préstamo',
    active: true,
  },
]
