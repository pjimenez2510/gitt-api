/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PgTable } from 'drizzle-orm/pg-core'
import { Column, SelectedFields } from 'drizzle-orm'

export const excludeColumns = <
  TTable extends PgTable,
  TColumns extends Array<keyof TTable['$inferSelect']>,
>(
  table: TTable,
  ...columns: TColumns
): SelectedFields<any, any> => {
  const result: SelectedFields<any, any> = {}

  Object.entries(table).forEach(([key, value]) => {
    if (
      !columns.includes(key as any) &&
      typeof value === 'object' &&
      'getSQL' in value
    ) {
      result[key] = value as Column
    }
  })

  return result
}
