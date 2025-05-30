import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class FilterItemImageDto {
  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page = 1

  @ApiPropertyOptional({
    description: 'Límite de registros por página',
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit = 10

  @ApiPropertyOptional({ description: 'ID del ítem' })
  @Type(() => Number)
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
    description: 'Obtener todos los registros sin paginación',
  })
  @Type(() => Boolean)
  @IsOptional()
  allRecords = false
}
