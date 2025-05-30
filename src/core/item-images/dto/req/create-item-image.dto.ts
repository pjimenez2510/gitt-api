import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateItemImageDto {
  @ApiProperty({ description: 'ID del ítem al que pertenece la imagen' })
  @IsInt()
  @IsNotEmpty()
  itemId: number

  @ApiProperty({ description: 'Ruta del archivo de la imagen' })
  @IsString()
  @IsNotEmpty()
  filePath: string

  @ApiProperty({
    description: 'Tipo de imagen (PRIMARY, SECONDARY, DETAIL)',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string

  @ApiProperty({
    description: 'Indica si es la imagen principal del ítem',
    required: false,
    default: false,
  })
  @IsOptional()
  isPrimary?: boolean

  @ApiProperty({
    description: 'Descripción de la imagen',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string
}
