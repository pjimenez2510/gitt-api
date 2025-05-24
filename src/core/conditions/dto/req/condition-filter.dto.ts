import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { Transform } from 'class-transformer'

export class FilterConditionDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre de la condición (búsqueda parcial)',
    example: 'Nuev',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descripción (búsqueda parcial)',
    example: 'mantenimiento',
  })
  description?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  @ApiPropertyOptional({
    description: 'Requiere mantenimiento',
    example: true,
  })
  requiresMaintenance?: boolean
}
