import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/req/create-user.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { person, user } from 'drizzle/schema'
import { and, count, desc, eq, ne, or, sql } from 'drizzle-orm'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { UserResDto } from './dto/res/user-res.dto'
import { PersonResDto } from '../people/dto/res/person-res.dto'
import { UpdateUserDto } from './dto/req/update-user.dto'
import { USER_STATUS } from './types/user-status.enum'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ApiPaginatedRes } from 'src/common/types/api-response.interface'

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  private usersWithoutPassword = excludeColumns(user, 'passwordHash')

  async findAll({
    limit,
    page,
  }: BaseParamsDto): Promise<ApiPaginatedRes<UserResDto>> {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select()
      .from(user)
      .leftJoin(person, eq(user.personId, person.id))
      .orderBy(desc(user.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db.select({ count: count() }).from(user)

    const [rawRecords, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    // Transformamos la estructura de los registros
    const records = rawRecords.map((record) => {
      const { users, people } = record
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, personId, ...userData } = users

      return {
        ...userData,
        person: people as PersonResDto,
      }
    })

    return {
      records,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findById(id: number): Promise<UserResDto> {
    const [userFound] = await this.dbService.db
      .select()
      .from(user)
      .leftJoin(person, eq(user.personId, person.id))
      .where(eq(user.id, id))
      .limit(1)
      .execute()

    if (!userFound) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    const { users, people } = userFound
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, personId, ...userData } = users

    return {
      ...userData,
      person: people as PersonResDto,
    }
  }

  async create(dto: CreateUserDto) {
    const [alreadyExistPersonAssociated] = await this.dbService.db
      .select()
      .from(person)
      .leftJoin(user, eq(user.personId, person.id))
      .where(
        or(
          eq(sql<string>`lower(${person.dni})`, dto.person.dni),
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
        'Ya existe un usuario registrado',
        HttpStatus.CONFLICT,
      )
    }

    const passwordHash = hashPassword(dto.password)

    await this.dbService.db.transaction(async (tx) => {
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

      await tx
        .insert(user)
        .values({
          ...dto,
          personId: newPerson.id,
          passwordHash,
        })
        .execute()
    })
  }

  async update(id: number, dto: UpdateUserDto) {
    const existingUser = await this.findById(id)

    if (dto.person?.email || dto.person?.dni || dto.userName) {
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

    return this.dbService.db.transaction(async (tx) => {
      if (dto.person) {
        await tx
          .update(person)
          .set({
            ...dto.person,
            birthDate: dto.person.birthDate
              ? new Date(dto.person.birthDate).toISOString()
              : undefined,
            // Solo actualizar email si viene en el DTO
            email: dto.person.email
              ? dto.person.email.toLowerCase()
              : undefined,
          })
          .where(eq(person.id, existingUser.person.id))
          .execute()
      }

      await tx
        .update(user)
        .set({
          userName: dto.userName ? dto.userName.toLowerCase() : undefined,
          // Solo actualizar password si viene en el DTO
          passwordHash: dto.password ? hashPassword(dto.password) : undefined,
          // Otros campos del usuario que puedan actualizarse
          ...(dto as Partial<Omit<UpdateUserDto, 'password'>>),
        })
        .where(eq(user.id, id))
        .execute()
    })
  }

  async changeStatus(id: number, status: USER_STATUS) {
    await this.findById(id)

    await this.dbService.db
      .update(user)
      .set({ status })
      .where(eq(user.id, id))
      .execute()
  }
}
