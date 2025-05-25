import { warehouseColumnsAndWith } from 'src/core/warehouses/const/warehouse-columns-and-with'

export const locationColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
    active: false,
  },
  with: {
    warehouse: warehouseColumnsAndWith,
  },
}
