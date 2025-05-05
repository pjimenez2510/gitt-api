import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'nombre del almacén',
    example: 'Almacén Central',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name: string

  @ApiProperty({
    description: 'ubicación del almacén (es opcional)',
    example: 'Calle Principal 123, Ciudad',
  })
  @IsString({ message: 'La ubicación debe ser un string' })
  @MaxLength(255, {
    message: 'La ubicación no puede tener más de 255 caracteres',
  })
  @IsOptional()
  location?: string

  @ApiProperty({
    description: 'ID del responsable del almacén (es opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNumber()
  @IsOptional()
  responsibleId?: number

  @ApiProperty({
    description: 'descripción del almacén (es opcional)',
    example: 'Almacén principal para productos terminados',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string
}
