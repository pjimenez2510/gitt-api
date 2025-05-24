import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class FilterWarehouseDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para nombre del almacén',
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Término de búsqueda para ubicación del almacén',
  })
  location?: string
}
