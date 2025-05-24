import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateStateDto {
  @ApiProperty({
    description: 'nombre del estado (debe ser único)',
    example: 'Activo',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string

  @ApiProperty({
    description: 'descripción (es opcional)',
    example: 'Estado que indica que el ítem está activo y disponible',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  @MaxLength(255, {
    message: 'La descripción no puede tener más de 255 caracteres',
  })
  description?: string
}
