import { ApiProperty } from '@nestjs/swagger'

export class ItemImageResDto {
  @ApiProperty({ description: 'ID de la imagen' })
  id: number

  @ApiProperty({ description: 'ID del ítem al que pertenece la imagen' })
  itemId: number

  @ApiProperty({ description: 'Ruta del archivo de la imagen' })
  filePath: string

  @ApiProperty({
    description: 'Tipo de imagen (PRIMARY, SECONDARY, DETAIL)',
    required: false,
  })
  type: string

  @ApiProperty({
    description: 'Indica si es la imagen principal del ítem',
    default: false,
  })
  isPrimary: boolean

  @ApiProperty({
    description: 'Descripción de la imagen',
    required: false,
  })
  description: string

  @ApiProperty({
    description: 'Fecha en que se tomó la foto',
    required: false,
  })
  photoDate: Date
}
