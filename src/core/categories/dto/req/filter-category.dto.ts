import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { Transform } from 'class-transformer'

export class FilterCategoryDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para código de la categoría',
  })
  code?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para nombre de la categoría',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para descripción de la categoría',
  })
  description?: string

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @ApiPropertyOptional({
    description: 'ID de la categoría padre',
  })
  parentCategoryId?: number
}
