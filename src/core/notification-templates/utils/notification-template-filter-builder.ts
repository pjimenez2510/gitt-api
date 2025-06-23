import { SQL, ilike, eq, and } from 'drizzle-orm'
import { notificationTemplate } from 'drizzle/schema'
import { FilterNotificationTemplateDto } from '../dto/req/filter-notification-template.dto'

export function buildNotificationTemplateFilterConditions(
  filterDto: FilterNotificationTemplateDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.type) {
    conditions.push(
      eq(
        notificationTemplate.type,
        filterDto.type as
          | 'LOAN'
          | 'RETURN'
          | 'MAINTENANCE'
          | 'SYSTEM'
          | 'EXPIRATION',
      ),
    )
  }

  if (filterDto.templateTitle) {
    conditions.push(
      ilike(notificationTemplate.templateTitle, `%${filterDto.templateTitle}%`),
    )
  }

  if (filterDto.templateContent) {
    conditions.push(
      ilike(
        notificationTemplate.templateContent,
        `%${filterDto.templateContent}%`,
      ),
    )
  }

  if (filterDto.channels) {
    conditions.push(
      ilike(notificationTemplate.channels, `%${filterDto.channels}%`),
    )
  }

  conditions.push(eq(notificationTemplate.active, true))

  return conditions
}

export function buildNotificationTemplateWhereClause(
  conditions: SQL[],
): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
