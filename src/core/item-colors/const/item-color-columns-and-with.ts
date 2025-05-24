import { colorColumnsAndWith } from 'src/core/colors/const/color-columns-and-with'

export const itemColorColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
    active: false,
    colorId: false,
  },
  with: {
    color: colorColumnsAndWith,
  },
}
