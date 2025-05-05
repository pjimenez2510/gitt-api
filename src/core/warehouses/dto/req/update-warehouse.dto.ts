import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'
import { CreateWarehouseDto } from './create-warehouse.dto'

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiPropertyOptional({
    description: 'nombre del almacén',
    example: 'Almacén Secundario',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name?: string

  @ApiPropertyOptional({
    description: 'ubicación del almacén (es opcional)',
    example: 'Avenida Secundaria 456, Ciudad',
  })
  @IsString({ message: 'La ubicación debe ser un string' })
  @MaxLength(255, {
    message: 'La ubicación no puede tener más de 255 caracteres',
  })
  @IsOptional()
  location?: string

  @ApiPropertyOptional({
    description: 'ID del responsable del almacén (es opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNumber()
  @IsOptional()
  responsibleId?: number

  @ApiPropertyOptional({
    description: 'descripción del almacén (es opcional)',
    example: 'Almacén secundario para materias primas',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @IsOptional()
  updateDate?: Date = new Date()
}
