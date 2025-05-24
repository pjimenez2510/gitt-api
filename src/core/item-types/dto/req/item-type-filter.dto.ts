import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class FilterItemTypeDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Código del tipo de ítem (búsqueda parcial)',
    example: 'IT',
  })
  code?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre del tipo de ítem (búsqueda parcial)',
    example: 'Mob',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descripción (búsqueda parcial)',
    example: 'muebles',
  })
  description?: string
}
