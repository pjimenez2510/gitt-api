import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, Min, IsBoolean } from 'class-validator'

export class BaseParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    required: false,
    default: 1,
  })
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Number of records to return',
    example: 10,
    required: false,
    default: 10,
  })
  limit: number = 10

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Si es true, devuelve todos los registros sin paginación',
    example: false,
    required: false,
    default: false,
  })
  allRecords: boolean = false
}
