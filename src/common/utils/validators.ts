export const isValidField = (
  fieldName: string | undefined,
  modelFields: object,
) => {
  if (!fieldName) return false
  return Object.keys(modelFields).includes(fieldName)
}

export const isValidSortOrder = (sort: string | undefined) => {
  if (!sort) return false
  return ['asc', 'desc'].includes(sort.toLowerCase())
}
