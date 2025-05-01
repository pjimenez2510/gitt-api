import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { count, desc, eq, sql } from 'drizzle-orm'
import { status } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateStatusDto } from './dto/req/create-status.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateStatusDto } from './dto/req/update-status.dto'

@Injectable()
export class StatesService {
  constructor(private dbService: DatabaseService) {}

  private statesWithoutDates = excludeColumns(
    status,
    'registrationDate',
    'updateDate',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.statesWithoutDates)
      .from(status)
      .orderBy(desc(status.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db.select({ count: count() }).from(status)

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string) {
    const [record] = await this.dbService.db
      .select(this.statesWithoutDates)
      .from(status)
      .where(eq(status.id, id))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`status with id ${id} not found`)
    }
    return record
  }

  async create(dto: CreateStatusDto) {
    const [alreadyExistStatus] = await this.dbService.db
      .select(this.statesWithoutDates)
      .from(status)
      .where(eq(sql<string>`lower(${status.name})`, dto.name.toLowerCase()))
      .limit(1)
      .execute()

    if (alreadyExistStatus) {
      throw new DisplayableException(
        'Ya existe una categoria con este codigo',
        HttpStatus.CONFLICT,
      )
    }

    const [newStatus] = await this.dbService.db
      .insert(status)
      .values({
        name: dto.name,
        description: dto.description,
        requiresMaintenance: dto.requiresMaintenance,
      })
      .returning(this.statesWithoutDates)
      .execute()
    return newStatus
  }

  async update(id: string, dto: UpdateStatusDto) {
    await this.findOne(id)

    const updateData: Partial<UpdateStatusDto> = {
      ...dto,
    }

    const [updateStatus] = await this.dbService.db
      .update(status)
      .set(updateData)
      .where(eq(status.id, id))
      .returning(this.statesWithoutDates)
      .execute()

    return updateStatus
  }

  async remove(id: string) {
    await this.findOne(id)

    const [deletedStatus] = await this.dbService.db
      .update(status)
      .set({ requiresMaintenance: false, updateDate: new Date() })
      .where(eq(status.id, id))
      .returning(this.statesWithoutDates)
      .execute()

    if (!deletedStatus) {
      throw new DisplayableException(
        `Error deleting status with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return deletedStatus
  }
}
