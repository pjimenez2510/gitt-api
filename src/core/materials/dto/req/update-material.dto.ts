import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateMaterialDto } from './create-material.dto'

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @ApiPropertyOptional({
    description: 'nombre del material (debe ser único)',
    example: 'Acero',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name?: string

  @ApiPropertyOptional({
    description: 'descripción (es opcional)',
    example: 'Material metálico para estructuras',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string

  @ApiPropertyOptional({
    description: 'tipo de material (es opcional)',
    example: 'Metal',
  })
  @IsString({ message: 'El tipo de material debe ser un string' })
  @IsOptional()
  materialType?: string

  @IsOptional()
  updateDate?: Date = new Date()
}
