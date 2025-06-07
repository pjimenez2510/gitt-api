import { ApiProperty } from '@nestjs/swagger'
import { ApiPropertyOptional } from '@nestjs/swagger/dist'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateItemImageDto {
  @ApiProperty({
    description: 'ID del ítem al que pertenece la imagen',
    example: 1,
  })
  @IsInt({ message: 'itemId debe ser un entero' })
  @IsNotEmpty({ message: 'itemId es requerido' })
  itemId: number

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen a subir (PNG, JPEG, JPG, GIF, máximo 10MB)',
  })
  file: Express.Multer.File

  @IsOptional()
  filePath?: string

  @ApiPropertyOptional({
    description: 'Tipo de imagen (PRIMARY, SECONDARY, DETAIL)',
    required: false,
    example: 'PRIMARY',
    enum: ['PRIMARY', 'SECONDARY', 'DETAIL'],
  })
  @IsString({ message: 'type debe ser una cadena de texto' })
  @IsOptional()
  type?: string

  @ApiPropertyOptional({
    description: 'Indica si es la imagen principal del ítem',
    required: false,
    default: false,
    example: false,
  })
  @IsBoolean({ message: 'isPrimary debe ser un booleano' })
  @IsOptional()
  isPrimary?: boolean

  @ApiPropertyOptional({
    description: 'Descripción de la imagen',
    required: false,
    example: 'Descripción de la imagen',
  })
  @IsString({ message: 'description debe ser una cadena de texto' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: 'Fecha en que se tomó la foto',
    required: false,
    example: '2023-01-01',
  })
  @IsString()
  @IsOptional()
  photoDate?: string
}
