import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
} from 'class-validator'
import { CapacityUnit } from '../../enum/capacity-unit.enum'
import { LocationType } from '../../enum/location-type'
export class CreateLocationDto {
  @ApiProperty({
    description: 'Nombre de la ubicación',
    example: 'Ubicación Central',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name: string

  @ApiProperty({
    description: 'Descripción de la ubicación (es opcional)',
    example: 'Ubicación principal para almacenamiento',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'ID de la ubicación padre (es opcional)',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID de la ubicación padre debe ser un número' })
  @IsOptional()
  parentLocationId?: number

  @ApiProperty({
    description: 'Tipo de ubicación',
    example: 'WAREHOUSE',
    enum: LocationType,
  })
  @IsEnum(LocationType, {
    message:
      'El tipo debe ser uno de los siguientes valores: ' +
      Object.values(LocationType).join(', '),
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  type: LocationType

  @ApiProperty({
    description: 'Piso de la ubicación (es opcional)',
    example: 'Piso 2',
  })
  @IsString({ message: 'El piso debe ser un string' })
  @MaxLength(50, { message: 'El piso no puede tener más de 50 caracteres' })
  @IsOptional()
  floor?: string

  @ApiProperty({
    description: 'Referencia de la ubicación (es opcional)',
    example: 'Cerca de la entrada principal',
  })
  @IsString({ message: 'La referencia debe ser un string' })
  @MaxLength(255, {
    message: 'La referencia no puede tener más de 255 caracteres',
  })
  @IsOptional()
  reference?: string

  @ApiProperty({
    description: 'Capacidad de la ubicación (es opcional)',
    example: 100,
  })
  @IsNumber({}, { message: 'La capacidad debe ser un número' })
  @IsOptional()
  capacity?: number

  @ApiProperty({
    description: 'Unidad de capacidad (es opcional)',
    example: 'UNITS',
    enum: CapacityUnit,
  })
  @IsEnum(CapacityUnit, {
    message:
      'La unidad de capacidad debe ser uno de los siguientes valores: ' +
      Object.values(CapacityUnit).join(', '),
  })
  @IsOptional()
  capacityUnit?: CapacityUnit

  @ApiProperty({
    description: 'Ocupación actual de la ubicación (es opcional)',
    example: 50,
  })
  @IsNumber({}, { message: 'La ocupación debe ser un número' })
  @IsOptional()
  occupancy?: number

  @ApiProperty({
    description: 'Código QR de la ubicación (es opcional)',
    example: 'QR12345',
  })
  @IsString({ message: 'El código QR debe ser un string' })
  @MaxLength(255, {
    message: 'El código QR no puede tener más de 255 caracteres',
  })
  @IsOptional()
  qrCode?: string

  @ApiProperty({
    description: 'Coordenadas de la ubicación (es opcional)',
    example: '40.7128,-74.0060',
  })
  @IsString({ message: 'Las coordenadas deben ser un string' })
  @IsOptional()
  coordinates?: string

  @ApiProperty({
    description: 'Notas adicionales sobre la ubicación (es opcional)',
    example: 'Ubicación con acceso restringido',
  })
  @IsString({ message: 'Las notas deben ser un string' })
  @IsOptional()
  notes?: string
}
