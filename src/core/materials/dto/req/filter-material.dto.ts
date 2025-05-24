import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class FilterMaterialDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para nombre del material',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para descripción del material',
  })
  description?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para tipo de material',
  })
  materialType?: string
}
