import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class FilterItemImageDto extends BaseParamsDto {
  @ApiPropertyOptional({ description: 'ID del ítem' })
  @Type(() => Number)
  @Transform(({ value }) => (value ? parseInt(value as string) : undefined))
  @IsInt()
  @IsOptional()
  itemId?: number

  @ApiPropertyOptional({
    description: 'Tipo de imagen (PRIMARY, SECONDARY, DETAIL)',
  })
  @IsString()
  @IsOptional()
  type?: string

  @ApiPropertyOptional({ description: 'Si es la imagen principal' })
  @Type(() => Boolean)
  @IsOptional()
  isPrimary?: boolean

  @ApiPropertyOptional({
    description: 'Fecha de la foto',
    required: false,
    example: '2023-01-01',
  })
  @IsString()
  @IsOptional()
  photoDate?: string
}
