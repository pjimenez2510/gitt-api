import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class WarehouseResDto {
  @ApiProperty({
    description: 'id del almacén',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  @Expose()
  id: string

  @ApiProperty({
    description: 'nombre del almacén',
    example: 'Almacén Central',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'ubicación del almacén',
    example: 'Calle Principal 123, Ciudad',
  })
  @Expose()
  location: string

  @ApiProperty({
    description: 'ID del responsable del almacén',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  responsibleId: string

  @ApiProperty({
    description: 'descripción del almacén',
    example: 'Almacén principal para productos terminados',
  })
  @Expose()
  description: string

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date

  @Exclude()
  active: boolean
}
