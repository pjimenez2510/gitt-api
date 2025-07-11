import { categoryColumnsAndWith } from 'src/core/categories/const/category-columns-and-with'
import { certificateColumnsAndWith } from 'src/core/certificates/const/certificate-columns-and-with'
import { conditionColumnsAndWith } from 'src/core/conditions/const/condition-columns-and-with'
import { itemColorColumnsAndWith } from 'src/core/item-colors/const/item-color-columns-and-with'
import { itemImageColumnsAndWith } from 'src/core/item-images/const/item-image-columns-and-with'
import { itemMaterialColumnsAndWith } from 'src/core/item-materials/const/item-material-columns-and-with'
import { itemTypeColumnsAndWith } from 'src/core/item-types/const/item-type-columns-and-with'
import { locationColumnsAndWith } from 'src/core/locations/const/location-columns-and-with'
import { statusColumnsAndWith } from 'src/core/states/const/state-columns-and-with'
import { userColumnsAndWith } from 'src/core/users/const/user-columns-and-with'

export const itemColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
  },
  with: {
    certificate: certificateColumnsAndWith,
    colors: itemColorColumnsAndWith,
    itemType: itemTypeColumnsAndWith,
    materials: itemMaterialColumnsAndWith,
    status: statusColumnsAndWith,
    condition: conditionColumnsAndWith,
    location: locationColumnsAndWith,
    category: categoryColumnsAndWith,
    images: itemImageColumnsAndWith,
    custodian: userColumnsAndWith,
  },
}
