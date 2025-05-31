import { ApiProperty } from '@nestjs/swagger'
import { ApiPropertyOptional } from '@nestjs/swagger/dist'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  buffer: Buffer
  destination?: string
  filename?: string
  path?: string
}

export class CreateItemImageDto {
  @ApiProperty({
    description: 'ID del ítem al que pertenece la imagen',
    example: 1,
  })
  @IsInt({ message: 'itemId debe ser un entero' })
  @IsNotEmpty({ message: 'itemId es requerido' })
  itemId: number

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  file?: MulterFile

  @IsOptional()
  filePath?: string

  @ApiProperty({
    description: 'Tipo de imagen (PRIMARY, SECONDARY, DETAIL)',
    required: false,
    example: 'PRIMARY',
    enum: ['PRIMARY', 'SECONDARY', 'DETAIL'],
  })
  @IsString({ message: 'type debe ser una cadena de texto' })
  @IsOptional()
  type?: string

  @ApiProperty({
    description: 'Indica si es la imagen principal del ítem',
    required: false,
    default: false,
    example: false,
  })
  @IsBoolean({ message: 'isPrimary debe ser un booleano' })
  @IsOptional()
  isPrimary?: boolean

  @ApiProperty({
    description: 'Descripción de la imagen',
    required: false,
    example: 'Descripción de la imagen',
  })
  @IsString({ message: 'description debe ser una cadena de texto' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'Fecha en que se tomó la foto',
    required: false,
    example: '2023-01-01',
  })
  @IsString()
  @IsOptional()
  photoDate?: string
}
