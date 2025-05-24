export const categoryColumnsAndWith = {
  columns: {
    registrationDate: false,
    updateDate: false,
    active: false,
    parentCategoryId: false,
  },
  with: {
    parentCategory: {
      columns: {
        registrationDate: false,
        updateDate: false,
        active: false,
      },
    },
  },
}
