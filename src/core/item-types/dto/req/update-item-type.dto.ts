import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateItemTypeDto } from './create-item-type.dto'

export class UpdateItemTypeDto extends PartialType(CreateItemTypeDto) {
  @ApiPropertyOptional({
    description: 'código (debe ser único)',
    example: 'IT001',
  })
  @IsString({ message: 'El código debe ser un string' })
  @IsNotEmpty({ message: 'El código es requerido' })
  code?: string

  @ApiPropertyOptional({
    description: 'nombre (es requerido)',
    example: 'Mobiliario',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name?: string

  @ApiPropertyOptional({
    description: 'descripción (es opcional)',
    example: 'Tipo para muebles y enseres',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string

  @ApiPropertyOptional({
    description: 'activo (es opcional)',
    example: true,
  })
  @IsBoolean({ message: 'activo debe ser un booleano' })
  @IsOptional()
  active?: boolean

  @IsOptional()
  updateDate?: Date = new Date()
}
