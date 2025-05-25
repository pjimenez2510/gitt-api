import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'
import { NormativeType } from '../../enums/normative-type.enum'
import { Origin } from '../../enums/origin.enum'

export class CreateItemDto {
  @ApiProperty({
    description: 'código del item',
    example: '10001',
  })
  @IsString({ message: 'El código debe ser un string' })
  @IsNotEmpty({ message: 'El código es requerido' })
  @MaxLength(50, { message: 'El código no puede tener más de 50 caracteres' })
  code: string

  @ApiProperty({
    description: 'cantidad en stock',
    example: 10,
    default: 0,
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @IsOptional()
  stock?: number = 0

  @ApiProperty({
    description: 'nombre del item',
    example: 'Laptop Dell XPS 13',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede tener más de 255 caracteres' })
  name: string

  @ApiProperty({
    description: 'descripción del item (opcional)',
    example: 'Laptop para uso administrativo',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'ID del tipo de item',
    example: 1,
  })
  @IsInt({ message: 'El tipo de item debe ser un número entero' })
  @IsNotEmpty({ message: 'El tipo de item es requerido' })
  itemTypeId: number

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @IsInt({ message: 'La categoría debe ser un número entero' })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  categoryId: number

  @ApiProperty({
    description: 'ID del estado',
    example: 1,
  })
  @IsInt({ message: 'El estado debe ser un número entero' })
  @IsNotEmpty({ message: 'El estado es requerido' })
  statusId: number

  @ApiProperty({
    description: 'tipo normativo',
    example: NormativeType.PROPERTY,
    enum: NormativeType,
  })
  @IsEnum(NormativeType, { message: 'Tipo normativo inválido' })
  @IsNotEmpty({ message: 'El tipo normativo es requerido' })
  normativeType: NormativeType

  @ApiProperty({
    description: 'origen del item (opcional)',
    example: Origin.PURCHASE,
    enum: Origin,
  })
  @IsEnum(Origin, { message: 'Origen inválido' })
  @IsOptional()
  origin?: Origin

  @ApiProperty({
    description: 'ID de la ubicación (opcional)',
    example: 1,
  })
  @IsInt({ message: 'La ubicación debe ser un número entero' })
  @IsOptional()
  locationId?: number

  @ApiProperty({
    description: 'ID del custodio (opcional)',
    example: 1,
  })
  @IsInt({ message: 'El custodio debe ser un número entero' })
  @IsOptional()
  custodianId?: number

  @ApiProperty({
    description: 'disponible para préstamo (opcional)',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'Disponible para préstamo debe ser un booleano' })
  @IsOptional()
  availableForLoan?: boolean = true

  @ApiProperty({
    description: 'identificador único (opcional)',
    example: 'LAP-001',
  })
  @IsString({ message: 'El identificador debe ser un string' })
  @IsOptional()
  @MaxLength(50, {
    message: 'El identificador no puede tener más de 50 caracteres',
  })
  identifier?: string

  @ApiProperty({
    description: 'código anterior (opcional)',
    example: 10001,
  })
  @IsString({ message: 'El código anterior debe ser un string' })
  @IsOptional()
  @MaxLength(50, {
    message: 'El código anterior no puede tener más de 50 caracteres',
  })
  previousCode?: string

  @ApiProperty({
    description: 'ID de la condición (opcional)',
    example: 1,
  })
  @IsInt({ message: 'La condición debe ser un número entero' })
  @IsOptional()
  conditionId?: number

  @ApiProperty({
    description: 'ID del certificado (opcional)',
    example: 1,
  })
  @IsInt({ message: 'El certificado debe ser un número entero' })
  @IsOptional()
  certificateId?: number

  @ApiProperty({
    description: 'origen de la entrada (opcional)',
    example: 'Compra',
  })
  @IsString({ message: 'El origen de la entrada debe ser un string' })
  @IsOptional()
  @MaxLength(100, {
    message: 'El origen de la entrada no puede tener más de 100 caracteres',
  })
  entryOrigin?: string

  @ApiProperty({
    description: 'tipo de entrada (opcional)',
    example: 'Compra',
  })
  @IsString({ message: 'El tipo de entrada debe ser un string' })
  @IsOptional()
  @MaxLength(100, {
    message: 'El tipo de entrada no puede tener más de 100 caracteres',
  })
  entryType?: string

  @ApiProperty({
    description: 'fecha de adquisición (opcional)',
    example: '2021-01-01',
  })
  @IsDateString({}, { message: 'La fecha de adquisición debe ser una fecha' })
  @IsOptional()
  acquisitionDate?: string

  @ApiProperty({
    description: 'número de compromiso (opcional)',
    example: '1234567890',
  })
  @IsString({ message: 'El número de compromiso debe ser un string' })
  @IsOptional()
  @MaxLength(100, {
    message: 'El número de compromiso no puede tener más de 100 caracteres',
  })
  commitmentNumber?: string

  @ApiProperty({
    description: 'modelo o características (opcional)',
    example: 'Dell XPS 13',
  })
  @IsString({ message: 'El modelo o características deben ser un string' })
  @IsOptional()
  @MaxLength(200, {
    message:
      'El modelo o características no pueden tener más de 200 caracteres',
  })
  modelCharacteristics?: string

  @ApiProperty({
    description: 'marca o raza o otro (opcional)',
    example: 'Dell',
  })
  @IsString({ message: 'La marca o raza o otro debe ser un string' })
  @IsOptional()
  @MaxLength(100, {
    message: 'La marca o raza o otro no puede tener más de 100 caracteres',
  })
  brandBreedOther?: string

  @ApiProperty({
    description: 'serie o número de identificación (opcional)',
    example: '1234567890',
  })
  @IsString({
    message: 'La serie o número de identificación debe ser un string',
  })
  @IsOptional()
  @MaxLength(100, {
    message:
      'La serie o número de identificación no puede tener más de 100 caracteres',
  })
  identificationSeries?: string

  @ApiProperty({
    description: 'fecha de garantía (opcional)',
    example: '2021-01-01',
  })
  @IsDateString({}, { message: 'La fecha de garantía debe ser una fecha' })
  @IsOptional()
  warrantyDate?: string

  @ApiProperty({
    description: 'dimensiones (opcional)',
    example: '10x10x10',
  })
  @IsString({ message: 'Las dimensiones deben ser un string' })
  @IsOptional()
  @MaxLength(100, {
    message: 'Las dimensiones no pueden tener más de 100 caracteres',
  })
  dimensions?: string

  @ApiProperty({
    description: 'critico (opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'El critico debe ser un booleano' })
  @IsOptional()
  critical?: boolean = false

  @ApiProperty({
    description: 'peligroso (opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'El peligroso debe ser un booleano' })
  @IsOptional()
  dangerous?: boolean = false

  @ApiProperty({
    description: 'requiere tratamiento especial (opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({
    message: 'El requiere tratamiento especial debe ser un booleano',
  })
  @IsOptional()
  requiresSpecialHandling?: boolean = false

  @ApiProperty({
    description: 'perishable (opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'El perishable debe ser un booleano' })
  @IsOptional()
  perishable?: boolean = false

  @ApiProperty({
    description: 'fecha de expiración (opcional)',
    example: '2021-01-01',
  })
  @IsDateString({}, { message: 'La fecha de expiración debe ser una fecha' })
  @IsOptional()
  expirationDate?: string

  @ApiProperty({
    description: 'línea de item (opcional)',
    example: 1,
  })
  @IsInt({ message: 'La línea de item debe ser un número entero' })
  @IsOptional()
  itemLine?: number

  @ApiProperty({
    description: 'cuenta contable (opcional)',
    example: '1234567890',
  })
  @IsString({ message: 'La cuenta contable debe ser un string' })
  @IsOptional()
  @MaxLength(50, {
    message: 'La cuenta contable no puede tener más de 50 caracteres',
  })
  accountingAccount?: string

  @ApiProperty({
    description: 'observaciones (opcional)',
    example: 'Observaciones del item',
  })
  @IsString({ message: 'Las observaciones deben ser un string' })
  @IsOptional()
  @MaxLength(200, {
    message: 'Las observaciones no pueden tener más de 200 caracteres',
  })
  observations?: string
}
