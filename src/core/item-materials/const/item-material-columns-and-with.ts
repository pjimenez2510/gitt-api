import { materialColumnsAndWith } from 'src/core/materials/const/material-columns-and-with'

export const itemMaterialColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
    active: false,
    materialId: false,
  },
  with: {
    material: materialColumnsAndWith,
  },
}
