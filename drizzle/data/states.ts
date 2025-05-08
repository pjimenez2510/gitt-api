import { status } from 'drizzle/schema/tables/inventory/status'

export const statesSeed: (typeof status.$inferInsert)[] = [
  {
    name: 'Activo',
    description: 'Activo',
    requiresMaintenance: false,
  },
  {
    name: 'En reparación',
    description: 'En reparación',
    requiresMaintenance: true,
  },
  {
    name: 'En servicio',
    description: 'En servicio',
    requiresMaintenance: true,
  },
  {
    name: 'En préstamo',
    description: 'En préstamo',
    requiresMaintenance: true,
  },
]
