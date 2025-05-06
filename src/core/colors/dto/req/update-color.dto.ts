import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { CreateColorDto } from './create-color.dto'

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @ApiPropertyOptional({
    description: 'nombre del color (debe ser único)',
    example: 'Azul',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  name?: string

  @ApiPropertyOptional({
    description: 'código hexadecimal del color (es opcional)',
    example: '#0000FF',
  })
  @IsString({ message: 'El código hexadecimal debe ser un string' })
  @IsHexColor({
    message: 'El código hexadecimal debe tener un formato válido (#RRGGBB)',
  })
  @MaxLength(7, {
    message: 'El código hexadecimal no puede tener más de 7 caracteres',
  })
  @IsOptional()
  hexCode?: string

  @ApiPropertyOptional({
    description: 'descripción (es opcional)',
    example: 'Color azul intenso',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @IsOptional()
  updateDate?: Date = new Date()
}
