import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { Transform } from 'class-transformer'

export class FilterItemMaterialDto extends BaseParamsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(String(value)) : undefined))
  @ApiPropertyOptional({
    description: 'ID del ítem',
    example: 1,
  })
  itemId?: number

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(String(value)) : undefined))
  @ApiPropertyOptional({
    description: 'ID del material',
    example: 2,
  })
  materialId?: number

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  @ApiPropertyOptional({
    description: 'Indica si es el material principal',
    example: true,
  })
  isMainMaterial?: boolean
}
