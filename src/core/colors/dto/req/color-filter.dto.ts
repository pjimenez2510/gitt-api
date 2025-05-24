import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class FilterColorDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre del color (búsqueda parcial)',
    example: 'Roj',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Código hexadecimal (búsqueda exacta)',
    example: '#FF0000',
  })
  hexCode?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descripción (búsqueda parcial)',
    example: 'brillante',
  })
  description?: string
}
