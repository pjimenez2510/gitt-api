import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FilterLocationDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nombre de la ubicación' })
  name?: string
}
