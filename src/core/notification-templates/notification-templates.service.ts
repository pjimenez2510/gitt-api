import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateNotificationTemplateDto } from './dto/req/create-notification-template.dto'
import { UpdateNotificationTemplateDto } from './dto/req/update-notification-template.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { notificationTemplate } from 'drizzle/schema'
import { NotificationTemplateResDto } from './dto/res/notification-template-res.dto'
import { plainToInstance } from 'class-transformer'
import { FilterNotificationTemplateDto } from './dto/req/filter-notification-template.dto'
import {
  buildNotificationTemplateFilterConditions,
  buildNotificationTemplateWhereClause,
} from './utils/notification-template-filter-builder'
import { notificationTemplateColumnsAndWith } from './const/notification-template-columns-and-with'
import { count, desc } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

@Injectable()
export class NotificationTemplatesService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(dto: CreateNotificationTemplateDto) {
    const [newNotificationTemplate] = await this.dbService.db
      .insert(notificationTemplate)
      .values(dto)
      .returning()
      .execute()

    return plainToInstance(NotificationTemplateResDto, newNotificationTemplate)
  }

  async findAll(filterDto: FilterNotificationTemplateDto) {
    const conditions = buildNotificationTemplateFilterConditions(filterDto)
    const whereClause = buildNotificationTemplateWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.notificationTemplate.findMany({
      where: whereClause,
      with: notificationTemplateColumnsAndWith.with,
      columns: notificationTemplateColumnsAndWith.columns,
      orderBy: [desc(notificationTemplate.id)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(notificationTemplate)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(NotificationTemplateResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.notificationTemplate.findFirst(
      {
        where: eq(notificationTemplate.id, id),
        with: notificationTemplateColumnsAndWith.with,
        columns: notificationTemplateColumnsAndWith.columns,
      },
    )

    if (!record) {
      throw new NotFoundException(
        `Plantilla de notificación con id ${id} no encontrada`,
      )
    }

    return plainToInstance(NotificationTemplateResDto, record)
  }

  async update(id: number, dto: UpdateNotificationTemplateDto) {
    const exists = await this.findOne(id)

    if (!exists) {
      throw new NotFoundException(
        `Plantilla de notificación con id ${id} no encontrada`,
      )
    }

    const [updatedNotificationTemplate] = await this.dbService.db
      .update(notificationTemplate)
      .set(dto)
      .where(eq(notificationTemplate.id, id))
      .returning()
      .execute()

    return plainToInstance(
      NotificationTemplateResDto,
      updatedNotificationTemplate,
    )
  }

  async remove(id: number) {
    const exists = await this.findOne(id)

    if (!exists) {
      throw new NotFoundException(
        `Plantilla de notificación con id ${id} no encontrada`,
      )
    }

    const [updatedNotificationTemplate] = await this.dbService.db
      .update(notificationTemplate)
      .set({ active: false, updateDate: new Date() })
      .where(eq(notificationTemplate.id, id))
      .returning({ active: notificationTemplate.active })
      .execute()

    return updatedNotificationTemplate.active === false
  }
}
