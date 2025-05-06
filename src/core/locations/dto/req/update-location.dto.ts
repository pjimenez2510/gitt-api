import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { CreateLocationDto } from './create-location.dto'

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @ApiPropertyOptional({
    description: 'Nombre de la ubicación',
    example: 'Almacén Principal',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name?: string

  @ApiPropertyOptional({
    description: 'Descripción de la ubicación',
    example: 'Ubicación principal para almacenamiento',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: 'ID del almacén asociado',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del almacén debe ser un número' })
  @IsOptional()
  warehouseId?: number

  @ApiPropertyOptional({
    description: 'ID de la ubicación padre',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID de la ubicación padre debe ser un número' })
  @IsOptional()
  parentLocationId?: number

  @ApiPropertyOptional({
    description: 'Tipo de ubicación',
    example: 'Almacén',
  })
  @IsString({ message: 'El tipo debe ser un string' })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  type?: string

  @ApiPropertyOptional({
    description: 'Edificio de la ubicación',
    example: 'Edificio A',
  })
  @IsString({ message: 'El edificio debe ser un string' })
  @MaxLength(100, {
    message: 'El edificio no puede tener más de 100 caracteres',
  })
  @IsOptional()
  building?: string

  @ApiPropertyOptional({
    description: 'Piso de la ubicación',
    example: 'Piso 2',
  })
  @IsString({ message: 'El piso debe ser un string' })
  @MaxLength(50, { message: 'El piso no puede tener más de 50 caracteres' })
  @IsOptional()
  floor?: string

  @ApiPropertyOptional({
    description: 'Referencia de la ubicación',
    example: 'Cerca de la entrada principal',
  })
  @IsString({ message: 'La referencia debe ser un string' })
  @MaxLength(255, {
    message: 'La referencia no puede tener más de 255 caracteres',
  })
  @IsOptional()
  reference?: string

  @ApiPropertyOptional({
    description: 'Capacidad de la ubicación',
    example: 100,
  })
  @IsNumber({}, { message: 'La capacidad debe ser un número' })
  @IsOptional()
  capacity?: number

  @ApiPropertyOptional({
    description: 'Unidad de capacidad',
    example: 'Cajas',
  })
  @IsString({ message: 'La unidad de capacidad debe ser un string' })
  @IsOptional()
  capacityUnit?: string

  @ApiPropertyOptional({
    description: 'Ocupación actual de la ubicación',
    example: 50,
  })
  @IsNumber({}, { message: 'La ocupación debe ser un número' })
  @IsOptional()
  occupancy?: number

  @ApiPropertyOptional({
    description: 'Código QR de la ubicación',
    example: 'QR123456',
  })
  @IsString({ message: 'El código QR debe ser un string' })
  @MaxLength(255, {
    message: 'El código QR no puede tener más de 255 caracteres',
  })
  @IsOptional()
  qrCode?: string

  @ApiPropertyOptional({
    description: 'Coordenadas de la ubicación',
    example: '19.432608, -99.133209',
  })
  @IsString({ message: 'Las coordenadas deben ser un string' })
  @IsOptional()
  coordinates?: string

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la ubicación',
    example: 'Ubicación en mantenimiento',
  })
  @IsString({ message: 'Las notas deben ser un string' })
  @IsOptional()
  notes?: string

  @ApiPropertyOptional({
    description: 'Estado activo de la ubicación',
    example: true,
  })
  @IsBoolean({ message: 'El estado activo debe ser un booleano' })
  @IsOptional()
  active?: boolean

  @ApiPropertyOptional({
    description: 'Fecha de actualización',
    example: '2023-01-01T00:00:00Z',
  })
  @IsDate({ message: 'La fecha de actualización debe ser una fecha válida' })
  @IsOptional()
  updateDate?: Date = new Date()
}
