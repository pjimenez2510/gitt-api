import { ApiProperty } from '@nestjs/swagger'

export class WarehouseResDto {
  @ApiProperty({
    description: 'id del almacén',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'nombre del almacén',
    example: 'Almacén Central',
  })
  name: string

  @ApiProperty({
    description: 'ubicación del almacén',
    example: 'Calle Principal 123, Ciudad',
  })
  location: string

  @ApiProperty({
    description: 'ID del responsable del almacén',
    example: 1,
  })
  responsibleId: number

  @ApiProperty({
    description: 'descripción del almacén',
    example: 'Almacén principal para productos terminados',
  })
  description: string
}
