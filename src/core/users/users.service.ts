import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/req/create-user.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { and, count, desc, eq, ne, or, sql } from 'drizzle-orm'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { UserResDto } from './dto/res/user-res.dto'
import { UpdateUserDto } from './dto/req/update-user.dto'
import { USER_STATUS } from './types/user-status.enum'
import { ApiPaginatedRes } from 'src/common/types/api-response.interface'
import { user } from 'drizzle/schema/tables/users/user'
import { person } from 'drizzle/schema/tables/users/person'
import { UserFiltersDto } from './dto/req/user-filters.dto'
import { userColumnsAndWith } from './const/user-columns-and-with'
import {
  buildUserFilterConditions,
  buildUserWhereClause,
} from './utils/user-filter-builder'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(
    filterDto: UserFiltersDto,
  ): Promise<ApiPaginatedRes<UserResDto>> {
    const conditions = buildUserFilterConditions(filterDto)
    const whereClause = buildUserWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.user.findMany({
      where: whereClause,
      columns: userColumnsAndWith.columns,
      with: userColumnsAndWith.with,
      orderBy: [desc(user.id)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(user)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(UserResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number): Promise<boolean> {
    const [record] = await this.dbService.db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, id))
      .limit(1)
      .execute()

    return !!record
  }

  async findById(id: number): Promise<UserResDto> {
    const record = await this.dbService.db.query.user.findFirst({
      where: eq(user.id, id),
      columns: userColumnsAndWith.columns,
      with: userColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }

    return plainToInstance(UserResDto, record)
  }

  async create(dto: CreateUserDto) {
    const [alreadyExistPersonAssociated] = await this.dbService.db
      .select()
      .from(person)
      .leftJoin(user, eq(user.personId, person.id))
      .where(
        or(
          eq(sql<string>`lower(${person.dni})`, dto.person.dni.toLowerCase()),
          eq(
            sql<string>`lower(${person.email})`,
            dto.person.email.toLowerCase(),
          ),
          eq(sql<string>`lower(${user.userName})`, dto.userName.toLowerCase()),
        ),
      )
      .limit(1)
      .execute()

    if (alreadyExistPersonAssociated) {
      throw new DisplayableException(
        'Ya existe un usuario registrado con estos datos',
        HttpStatus.CONFLICT,
      )
    }

    const passwordHash = hashPassword(dto.password)

    const newUser = await this.dbService.db.transaction(async (tx) => {
      const [newPerson] = await tx
        .insert(person)
        .values({
          ...dto.person,
          birthDate: dto.person.birthDate
            ? new Date(dto.person.birthDate).toISOString()
            : null,
        })
        .returning()
        .execute()

      const [newUser] = await tx
        .insert(user)
        .values({
          ...dto,
          personId: newPerson.id,
          passwordHash,
        })
        .returning()
        .execute()

      return newUser
    })

    return this.findById(newUser.id)
  }

  async update(id: number, dto: UpdateUserDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }

    if (dto.person?.email ?? dto.person?.dni ?? dto.userName) {
      const [conflict] = await this.dbService.db
        .select()
        .from(person)
        .leftJoin(user, eq(user.personId, person.id))
        .where(
          and(
            ne(user.id, id),
            or(
              dto.person?.dni
                ? eq(
                    sql<string>`lower(${person.dni})`,
                    dto.person.dni.toLowerCase(),
                  )
                : undefined,
              dto.person?.email
                ? eq(
                    sql<string>`lower(${person.email})`,
                    dto.person.email.toLowerCase(),
                  )
                : undefined,
              dto.userName
                ? eq(
                    sql<string>`lower(${user.userName})`,
                    dto.userName.toLowerCase(),
                  )
                : undefined,
            ),
          ),
        )
        .limit(1)
        .execute()

      if (conflict) {
        throw new DisplayableException(
          'Los datos actualizados entran en conflicto con otro usuario',
          HttpStatus.CONFLICT,
        )
      }
    }

    await this.dbService.db.transaction(async (tx) => {
      const userRecord = await tx.query.user.findFirst({
        where: eq(user.id, id),
        columns: {
          personId: true,
        },
      })

      if (!userRecord) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`)
      }

      if (dto.person) {
        await tx
          .update(person)
          .set({
            ...dto.person,
            birthDate: dto.person.birthDate
              ? new Date(dto.person.birthDate).toISOString()
              : undefined,
            email: dto.person.email
              ? dto.person.email.toLowerCase()
              : undefined,
          })
          .where(eq(person.id, userRecord.personId))
          .execute()
      }

      await tx
        .update(user)
        .set({
          userName: dto.userName ? dto.userName.toLowerCase() : undefined,
          passwordHash: dto.password ? hashPassword(dto.password) : undefined,
          career: dto.career,
          userType: dto.userType,
          status: dto.status,
        })
        .where(eq(user.id, id))
        .execute()
    })

    return this.findById(id)
  }

  async changeStatus(id: number, status: USER_STATUS) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }

    await this.dbService.db
      .update(user)
      .set({ status })
      .where(eq(user.id, id))
      .execute()

    return this.findById(id)
  }

  async findByDni(dni: string) {
    const record = await this.dbService.db.query.user.findFirst({
      where: eq(person.dni, dni),
      columns: userColumnsAndWith.columns,
      with: userColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Usuario con DNI: ${dni} no encontrado`)
    }

    return plainToInstance(UserResDto, record)
  }
}
