import { ApiProperty } from '@nestjs/swagger'
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateColorDto {
  @ApiProperty({
    description: 'nombre del color (debe ser único)',
    example: 'Rojo',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  name: string

  @ApiProperty({
    description: 'código hexadecimal del color (es opcional)',
    example: '#FF0000',
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

  @ApiProperty({
    description: 'descripción (es opcional)',
    example: 'Color rojo brillante',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string
}
