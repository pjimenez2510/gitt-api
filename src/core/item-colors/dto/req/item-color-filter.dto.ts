import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { Transform } from 'class-transformer'

export class FilterItemColorDto extends BaseParamsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(String(value)) : undefined))
  itemId?: number

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(String(value)) : undefined))
  @ApiPropertyOptional({
    description: 'ID del color',
    example: 2,
  })
  colorId?: number

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  @ApiPropertyOptional({
    description: 'Indica si es el color principal',
    example: true,
  })
  isMainColor?: boolean
}
