import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { count, desc, eq, sql } from 'drizzle-orm'
import { certificate } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateCertificateDto } from './dto/req/create-certificate.dto'
import { UpdateCertificateDto } from './dto/req/update-certificate.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import {
  certificateStatus,
  certificateType,
} from 'drizzle/schema/enums/inventory'

@Injectable()
export class CertificatesService {
  constructor(private dbService: DatabaseService) {}

  private readonly certificatesWithoutDates = excludeColumns(
    certificate,
    'registrationDate',
    'updateDate',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.certificatesWithoutDates)
      .from(certificate)
      .orderBy(desc(certificate.date))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(certificate)

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

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.certificatesWithoutDates)
      .from(certificate)
      .where(eq(certificate.id, id))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Certificate with id ${id} not found`)
    }
    return record
  }

  async create(dto: CreateCertificateDto) {
    const [alreadyExistCertificate] = await this.dbService.db
      .select(this.certificatesWithoutDates)
      .from(certificate)
      .where(
        eq(
          sql<string>`lower(${certificate.number}::text)`,
          dto.number.toString().toLowerCase(),
        ),
      )
      .limit(1)
      .execute()

    if (alreadyExistCertificate) {
      throw new DisplayableException(
        'A certificate with this number already exists',
        HttpStatus.CONFLICT,
      )
    }

    // Ensure type is a valid enum value
    const certificateTypeValue =
      dto.type as (typeof certificateType.enumValues)[number]
    const certificateStatusValue =
      dto.status as (typeof certificateStatus.enumValues)[number]

    const [newCertificate] = await this.dbService.db
      .insert(certificate)
      .values({
        number: dto.number,
        date: dto.date,
        type: certificateTypeValue,
        status: certificateStatusValue,
        deliveryResponsibleId: dto.deliveryResponsibleId,
        receptionResponsibleId: dto.receptionResponsibleId,
        observations: dto.observations,
        accounted: dto.accounted,
      })
      .returning(this.certificatesWithoutDates)
      .execute()

    return newCertificate
  }

  async update(id: number, dto: UpdateCertificateDto) {
    await this.findOne(id)

    // Create a properly typed update object
    const updateData: Record<string, unknown> = {}

    if (dto.number !== undefined) updateData.number = dto.number
    if (dto.date !== undefined) updateData.date = dto.date
    if (dto.type !== undefined)
      updateData.type = dto.type as (typeof certificateType.enumValues)[number]
    if (dto.status !== undefined)
      updateData.status =
        dto.status as (typeof certificateStatus.enumValues)[number]
    if (dto.deliveryResponsibleId !== undefined)
      updateData.deliveryResponsibleId = dto.deliveryResponsibleId
    if (dto.receptionResponsibleId !== undefined)
      updateData.receptionResponsibleId = dto.receptionResponsibleId
    if (dto.observations !== undefined)
      updateData.observations = dto.observations
    if (dto.accounted !== undefined) updateData.accounted = dto.accounted

    const [updatedCertificate] = await this.dbService.db
      .update(certificate)
      .set(updateData)
      .where(eq(certificate.id, id))
      .returning(this.certificatesWithoutDates)
      .execute()

    return updatedCertificate
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedCertificate] = await this.dbService.db
      .update(certificate)
      .set({ accounted: false, updateDate: new Date() })
      .where(eq(certificate.id, id))
      .returning(this.certificatesWithoutDates)
      .execute()

    if (!deletedCertificate) {
      throw new DisplayableException(
        `Error deleting certificate with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return deletedCertificate
  }
}
