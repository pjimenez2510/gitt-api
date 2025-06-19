import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { LocationType } from '../../enum/location-type'

export class FilterLocationDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre de la ubicación (búsqueda parcial)',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descripción de la ubicación (búsqueda parcial)',
  })
  description?: string

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(String(value)) : undefined))
  @ApiPropertyOptional({
    description: 'ID de la ubicación padre',
  })
  parentLocationId?: number

  @IsOptional()
  @IsEnum(LocationType, {
    message:
      'El tipo debe ser uno de los siguientes valores: ' +
      Object.values(LocationType).join(', '),
  })
  @ApiPropertyOptional({
    description: 'Tipo de ubicación',
    enum: LocationType,
  })
  type?: LocationType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Piso (búsqueda parcial)',
  })
  floor?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Referencia (búsqueda parcial)',
  })
  reference?: string
}
