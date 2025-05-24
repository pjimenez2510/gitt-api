import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { status } from 'drizzle/schema/tables/inventory/status'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateStateDto } from './dto/req/create-state.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateStateDto } from './dto/req/update-state.dto'
import { plainToInstance } from 'class-transformer'
import { StateResDto } from './dto/res/state-res.dto'
import { FilterStateDto } from './dto/req/filter-state.dto'
import { statusColumnsAndWith } from './const/state-columns-and-with'
import {
  buildStateFilterConditions,
  buildStateWhereClause,
} from './utils/state-filter-builder'

@Injectable()
export class StatesService {
  constructor(private readonly dbService: DatabaseService) {}

  private statusesWithoutDates = excludeColumns(
    status,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll(filterDto: FilterStateDto) {
    const conditions = buildStateFilterConditions(filterDto)
    const whereClause = buildStateWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const statusesResult = await this.dbService.db.query.status.findMany({
      where: whereClause,
      with: statusColumnsAndWith.with,
      columns: statusColumnsAndWith.columns,
      orderBy: [desc(status.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalResult = await this.dbService.db
      .select({ count: count() })
      .from(status)
      .where(whereClause)
      .execute()

    const total = totalResult[0].count

    return {
      records: statusesResult,
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const statusResult = await this.dbService.db.query.status.findFirst({
      where: and(eq(status.id, id), eq(status.active, true)),
      columns: {
        id: true,
      },
    })

    return statusResult?.id !== undefined
  }

  async findOne(id: number) {
    const statusResult = await this.dbService.db.query.status.findFirst({
      where: and(eq(status.id, id), eq(status.active, true)),
      columns: statusColumnsAndWith.columns,
      with: statusColumnsAndWith.with,
    })

    if (!statusResult) {
      throw new NotFoundException(`Estado con id ${id} no encontrado`)
    }

    return plainToInstance(StateResDto, statusResult)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return false

    const statusResult = await this.dbService.db.query.status.findFirst({
      where: and(
        eq(sql<string>`lower(${status.name})`, name.toLowerCase()),
        eq(status.active, true),
        excludeId ? not(eq(status.id, excludeId)) : undefined,
      ),
      columns: {
        id: true,
      },
    })

    return statusResult?.id !== undefined
  }

  async create(dto: CreateStateDto) {
    const alreadyExistStatusName = await this.existByName(dto.name)

    if (alreadyExistStatusName) {
      throw new DisplayableException(
        'Ya existe un estado con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [newStatus] = await this.dbService.db
      .insert(status)
      .values({
        ...dto,
      })
      .returning({ id: status.id })
      .execute()

    return this.findOne(newStatus.id)
  }

  async update(id: number, dto: UpdateStateDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Estado con id ${id} no encontrado`)
    }

    if (dto.name) {
      const alreadyExistStatusName = await this.existByName(dto.name, id)

      if (alreadyExistStatusName) {
        throw new DisplayableException(
          'Ya existe un estado con este nombre',
          HttpStatus.CONFLICT,
        )
      }
    }

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    await this.dbService.db
      .update(status)
      .set(updateData)
      .where(eq(status.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Estado con id ${id} no encontrado`)
    }

    const [statusToRemove] = await this.dbService.db
      .update(status)
      .set({
        active: false,
        updateDate: new Date(),
      })
      .where(eq(status.id, id))
      .returning({ active: status.active })
      .execute()

    return statusToRemove.active === false
  }
}
