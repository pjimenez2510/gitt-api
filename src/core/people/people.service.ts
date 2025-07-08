import {
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { CreatePersonDto } from './dto/req/create-person.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { and, count, desc, eq, ne, or, sql } from 'drizzle-orm'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { PersonResDto } from './dto/res/person-res.dto'
import { UpdatePersonDto } from './dto/req/update-person.dto'
import { PERSON_STATUS } from './types/person-status.enum'
import { PERSON_TYPE } from './types/person-type.enum'
import { ApiPaginatedRes } from 'src/common/types/api-response.interface'
import { person } from 'drizzle/schema/tables/users/person'
import { personColumnsAndWith } from './const/person-columns-and-with'
import {
  buildPersonFilterConditions,
  buildPersonWhereClause,
} from './utils/person-filter-builder'
import { plainToInstance } from 'class-transformer'
import { PersonFiltersDto } from './dto/req/person-filters.dto'
import { ExternalDbService } from 'src/global/external-db/external-db.service'

@Injectable()
export class PeopleService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly externalDbService: ExternalDbService,
  ) {}

  async findAll(
    filterDto: PersonFiltersDto,
  ): Promise<ApiPaginatedRes<PersonResDto>> {
    const conditions = buildPersonFilterConditions(filterDto)
    const whereClause = buildPersonWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.person.findMany({
      where: whereClause,
      columns: personColumnsAndWith.columns,
      with: personColumnsAndWith.with,
      orderBy: [desc(person.id)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(person)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(PersonResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number): Promise<boolean> {
    const [record] = await this.dbService.db
      .select({ id: person.id })
      .from(person)
      .where(eq(person.id, id))
      .limit(1)
      .execute()

    return !!record
  }

  async findById(id: number): Promise<PersonResDto> {
    const record = await this.dbService.db.query.person.findFirst({
      where: eq(person.id, id),
      columns: personColumnsAndWith.columns,
      with: personColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`)
    }

    return plainToInstance(PersonResDto, record)
  }

  async create(dto: CreatePersonDto) {
    const [alreadyExists] = await this.dbService.db
      .select()
      .from(person)
      .where(
        or(
          eq(sql<string>`lower(${person.dni})`, dto.dni.toLowerCase()),
          eq(sql<string>`lower(${person.email})`, dto.email.toLowerCase()),
        ),
      )
      .limit(1)
      .execute()

    if (alreadyExists) {
      throw new DisplayableException(
        'Ya existe una persona registrada con estos datos',
        HttpStatus.CONFLICT,
      )
    }

    const [newPerson] = await this.dbService.db
      .insert(person)
      .values({
        ...dto,
        email: dto.email.toLowerCase(),
        dni: dto.dni.toLowerCase(),
      })
      .returning()
      .execute()

    return this.findById(newPerson.id)
  }

  async update(id: number, dto: UpdatePersonDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`)
    }
    if (dto.email || dto.dni) {
      const [conflict] = await this.dbService.db
        .select()
        .from(person)
        .where(
          and(
            ne(person.id, id),
            or(
              dto.dni
                ? eq(sql<string>`lower(${person.dni})`, dto.dni.toLowerCase())
                : undefined,
              dto.email
                ? eq(
                    sql<string>`lower(${person.email})`,
                    dto.email.toLowerCase(),
                  )
                : undefined,
            ),
          ),
        )
        .limit(1)
        .execute()

      if (conflict) {
        throw new DisplayableException(
          'Los datos actualizados entran en conflicto con otra persona',
          HttpStatus.CONFLICT,
        )
      }
    }

    await this.dbService.db
      .update(person)
      .set({
        ...dto,
        email: dto.email ? dto.email.toLowerCase() : undefined,
        dni: dto.dni ? dto.dni.toLowerCase() : undefined,
      })
      .where(eq(person.id, id))
      .execute()

    return this.findById(id)
  }

  async changeStatus(id: number, status: PERSON_STATUS) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Persona con id ${id} no encontrada`)
    }

    await this.dbService.db
      .update(person)
      .set({ status })
      .where(eq(person.id, id))
      .execute()

    return this.findById(id)
  }

  async findByDni(dni: string) {
    const record = await this.dbService.db.query.person.findFirst({
      where: eq(person.dni, dni),
      columns: personColumnsAndWith.columns,
      with: personColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Persona con DNI: ${dni} no encontrada`)
    }

    return plainToInstance(PersonResDto, record)
  }

  async findOrCreatePersonByDni(dni: string): Promise<PersonResDto> {
    const record = await this.dbService.db.query.person.findFirst({
      where: eq(person.dni, dni),
      columns: personColumnsAndWith.columns,
      with: personColumnsAndWith.with,
    })

    if (!record) {
      const externalPerson = await this.externalDbService.findPersonByDni(dni)
      if (!externalPerson) {
        throw new NotFoundException(
          `Persona con DNI: ${dni} no encontrada en ninguna base de datos`,
        )
      }
      const personType =
        externalPerson.ROL.toUpperCase() === 'DOCENTES'
          ? PERSON_TYPE.TEACHER
          : PERSON_TYPE.STUDENT

      const createPersonDto: CreatePersonDto = {
        dni: externalPerson.CEDULA.trim(),
        firstName: externalPerson.NOMBRES.trim(),
        lastName: externalPerson.APELLIDOS.trim(),
        email: externalPerson.CORREO.trim(),
        phone: externalPerson.TELELFONO?.trim() || undefined,
        type: personType,
      }

      const newPerson = await this.create(createPersonDto)
      return newPerson
    } else {
      return plainToInstance(PersonResDto, record)
    }
  }

  async markAsDefaulter(identifier: string | number): Promise<PersonResDto> {
    let personRecord: any

    if (typeof identifier === 'number') {
      // Buscar por ID
      personRecord = await this.dbService.db.query.person.findFirst({
        where: eq(person.id, identifier),
        columns: personColumnsAndWith.columns,
        with: personColumnsAndWith.with,
      })
    } else {
      // Buscar por DNI
      personRecord = await this.dbService.db.query.person.findFirst({
        where: eq(person.dni, identifier.toLowerCase()),
        columns: personColumnsAndWith.columns,
        with: personColumnsAndWith.with,
      })
    }

    if (!personRecord) {
      const identifierType = typeof identifier === 'number' ? 'ID' : 'DNI'
      throw new NotFoundException(
        `Persona con ${identifierType}: ${identifier} no encontrada`,
      )
    }

    // Verificar si ya está en estado moroso
    if (personRecord.status === PERSON_STATUS.DEFAULTER) {
      throw new BadRequestException('La persona ya está en estado moroso')
    }

    await this.dbService.db
      .update(person)
      .set({ status: PERSON_STATUS.DEFAULTER })
      .where(eq(person.id, personRecord.id))
      .execute()

    return plainToInstance(PersonResDto, {
      ...personRecord,
      status: PERSON_STATUS.DEFAULTER,
    })
  }

  async removeDefaulterStatus(
    identifier: string | number,
  ): Promise<PersonResDto> {
    let personRecord: any

    if (typeof identifier === 'number') {
      // Buscar por ID
      personRecord = await this.dbService.db.query.person.findFirst({
        where: eq(person.id, identifier),
        columns: personColumnsAndWith.columns,
        with: personColumnsAndWith.with,
      })
    } else {
      // Buscar por DNI
      personRecord = await this.dbService.db.query.person.findFirst({
        where: eq(person.dni, identifier.toLowerCase()),
        columns: personColumnsAndWith.columns,
        with: personColumnsAndWith.with,
      })
    }

    if (!personRecord) {
      const identifierType = typeof identifier === 'number' ? 'ID' : 'DNI'
      throw new NotFoundException(
        `Persona con ${identifierType}: ${identifier} no encontrada`,
      )
    }

    // Verificar si no está en estado moroso
    if (personRecord.status !== PERSON_STATUS.DEFAULTER) {
      throw new BadRequestException('La persona no está en estado moroso')
    }

    await this.dbService.db
      .update(person)
      .set({ status: PERSON_STATUS.ACTIVE })
      .where(eq(person.id, personRecord.id))
      .execute()

    return plainToInstance(PersonResDto, {
      ...personRecord,
      status: PERSON_STATUS.ACTIVE,
    })
  }
}
