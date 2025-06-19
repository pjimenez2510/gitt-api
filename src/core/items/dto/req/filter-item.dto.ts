import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { Transform, Type } from 'class-transformer'
import { NormativeType } from '../../enums/normative-type.enum'
import { Origin } from '../../enums/origin.enum'

export class FilterItemDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Código del ítem',
  })
  code?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Código anterior del ítem',
  })
  previousCode?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Identificador del ítem',
  })
  identifier?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'ID del certificado',
  })
  certificateId?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'ID del tipo de ítem',
  })
  itemTypeId?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre del ítem',
  })
  name?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'ID de la categoría',
  })
  categoryId?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'ID del estado',
  })
  statusId?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'ID de la condición',
  })
  conditionId?: number

  @IsOptional()
  @IsEnum(NormativeType)
  @ApiPropertyOptional({
    description: 'Tipo normativo',
    enum: NormativeType,
  })
  normativeType?: NormativeType

  @IsOptional()
  @IsEnum(Origin)
  @ApiPropertyOptional({
    description: 'Origen',
    enum: Origin,
  })
  origin?: Origin

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Tipo de entrada',
  })
  entryType?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'Fecha de adquisición desde',
  })
  acquisitionDateFrom?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'Fecha de adquisición hasta',
  })
  acquisitionDateTo?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Características del modelo',
  })
  modelCharacteristics?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Marca, raza o otro',
  })
  brandBreedOther?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Serie de identificación',
  })
  identificationSeries?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Es crítico',
  })
  critical?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Es peligroso',
  })
  dangerous?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Requiere tratamiento especial',
  })
  requiresSpecialHandling?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Es perecedero',
  })
  perishable?: boolean

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'Fecha de expiración desde',
  })
  expirationDateFrom?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'Fecha de expiración hasta',
  })
  expirationDateTo?: Date

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'ID de la ubicación',
  })
  locationId?: number

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Está disponible para préstamo',
  })
  availableForLoan?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Tiene custodio activo',
  })
  activeCustodian?: boolean
}
