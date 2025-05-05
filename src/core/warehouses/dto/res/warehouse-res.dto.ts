import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class WarehouseResDto {
  @ApiProperty({
    description: 'id del almacén',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  @Expose()
  id: number

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
    example: 1,
  })
  @Expose()
  responsibleId: number

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
