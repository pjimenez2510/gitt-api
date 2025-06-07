import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not } from 'drizzle-orm'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateCertificateDto } from './dto/req/create-certificate.dto'
import { UpdateCertificateDto } from './dto/req/update-certificate.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import {
  certificateStatus,
  certificateType,
} from 'drizzle/schema/enums/inventory'
import { certificate } from 'drizzle/schema/tables/inventory/certificate'
import { FilterCertificateDto } from './dto/req/certificate-filter.dto'
import { certificateColumnsAndWith } from './const/certificate-columns-and-with'
import {
  buildCertificateFilterConditions,
  buildCertificateWhereClause,
} from './utils/certificate-filter-builder'
import { plainToInstance } from 'class-transformer'
import { CertificateResDto } from './dto/res/certificate-res.dto'

@Injectable()
export class CertificatesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterCertificateDto) {
    const conditions = buildCertificateFilterConditions(filterDto)
    const whereClause = buildCertificateWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const certificatesResult =
      await this.dbService.db.query.certificate.findMany({
        where: whereClause,
        with: certificateColumnsAndWith.with,
        columns: certificateColumnsAndWith.columns,
        orderBy: [desc(certificate.date)],
        limit: filterDto.allRecords ? undefined : filterDto.limit,
        offset: filterDto.allRecords ? undefined : offset,
      })

    const totalResult = await this.dbService.db
      .select({ count: count() })
      .from(certificate)
      .where(whereClause)
      .execute()

    const total = totalResult[0].count

    return {
      records: certificatesResult,
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const certificateResult =
      await this.dbService.db.query.certificate.findFirst({
        where: eq(certificate.id, id),
        columns: {
          id: true,
        },
      })

    return certificateResult?.id !== undefined
  }

  async findOne(id: number) {
    const certificateResult =
      await this.dbService.db.query.certificate.findFirst({
        where: eq(certificate.id, id),
        columns: certificateColumnsAndWith.columns,
        with: certificateColumnsAndWith.with,
      })

    if (!certificateResult) {
      throw new NotFoundException(`Certificado con id ${id} no encontrado`)
    }

    return plainToInstance(CertificateResDto, certificateResult)
  }

  async existByNumber(number: number, excludeId?: number) {
    if (!number) return false

    const certificateResult =
      await this.dbService.db.query.certificate.findFirst({
        where: and(
          eq(certificate.number, number),
          excludeId ? not(eq(certificate.id, excludeId)) : undefined,
        ),
        columns: {
          id: true,
        },
      })

    return certificateResult?.id !== undefined
  }

  async create(dto: CreateCertificateDto) {
    const alreadyExistCertificateNumber = await this.existByNumber(dto.number)

    if (alreadyExistCertificateNumber) {
      throw new DisplayableException(
        'Ya existe un certificado con este número',
        HttpStatus.CONFLICT,
      )
    }

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
      .returning({ id: certificate.id })
      .execute()

    return this.findOne(newCertificate.id)
  }

  async update(id: number, dto: UpdateCertificateDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Certificado con id ${id} no encontrado`)
    }

    if (dto.number) {
      const alreadyExistCertificateNumber = await this.existByNumber(
        dto.number,
        id,
      )

      if (alreadyExistCertificateNumber) {
        throw new DisplayableException(
          'Ya existe un certificado con este número',
          HttpStatus.CONFLICT,
        )
      }
    }

    await this.dbService.db
      .update(certificate)
      .set(dto)
      .where(eq(certificate.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Certificado con id ${id} no encontrado`)
    }

    const [certificateToRemove] = await this.dbService.db
      .update(certificate)
      .set({
        accounted: false,
        updateDate: new Date(),
      })
      .where(eq(certificate.id, id))
      .returning({ accounted: certificate.accounted })
      .execute()

    return !certificateToRemove.accounted
  }
}
