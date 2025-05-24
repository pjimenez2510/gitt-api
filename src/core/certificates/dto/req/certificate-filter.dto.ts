import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { Transform } from 'class-transformer'
import { CertificateType } from '../../enums/certificate-type.enum'
import { CertificateStatus } from '../../enums/certificate-status.enum'

export class FilterCertificateDto extends BaseParamsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @ApiPropertyOptional({
    description: 'Número del certificado',
  })
  number?: number

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha del certificado (desde)',
    example: '2023-01-01',
  })
  dateFrom?: string

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha del certificado (hasta)',
    example: '2023-12-31',
  })
  dateTo?: string

  @IsOptional()
  @IsEnum(CertificateType)
  @ApiPropertyOptional({
    description: 'Tipo de certificado',
    enum: CertificateType,
  })
  type?: CertificateType

  @IsOptional()
  @IsEnum(CertificateStatus)
  @ApiPropertyOptional({
    description: 'Estado del certificado',
    enum: CertificateStatus,
  })
  status?: CertificateStatus

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @ApiPropertyOptional({
    description: 'ID del responsable de entrega',
  })
  deliveryResponsibleId?: number

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @ApiPropertyOptional({
    description: 'ID del responsable de recepción',
  })
  receptionResponsibleId?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para observaciones',
  })
  observations?: string
}
