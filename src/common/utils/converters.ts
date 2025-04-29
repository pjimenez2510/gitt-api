export const convertToFilterWhere = (
  value?: number | number[],
): number[] | undefined => {
  if (value === undefined) return undefined

  return Array.isArray(value) ? value : [value]
}

export const convertToStatusWhere = (
  status?: number | number[],
): boolean | undefined => {
  if (status === undefined || Array.isArray(status)) return undefined

  return status === 1
}

export const convertToSearchWhere = (search?: string): string | undefined => {
  if (search === undefined || search === '') return undefined

  return search
}
