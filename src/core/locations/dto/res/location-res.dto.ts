import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class LocationResDto {
  @ApiProperty({
    description: 'ID de la ubicación',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'Nombre de la ubicación',
    example: 'Almacén Secundario',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'Descripción de la ubicación',
    example: 'Ubicación para almacenamiento temporal',
  })
  @Expose()
  description: string

  @ApiProperty({
    description: 'ID del almacén asociado',
    example: 2,
  })
  @Expose()
  warehouseId: number

  @ApiProperty({
    description: 'ID de la ubicación padre',
    example: 3,
  })
  @Expose()
  parentLocationId: number

  @ApiProperty({
    description: 'Tipo de ubicación',
    example: 'Almacén',
  })
  @Expose()
  type: string

  @ApiProperty({
    description: 'Edificio donde se encuentra la ubicación',
    example: 'Edificio A',
  })
  @Expose()
  building: string

  @ApiProperty({
    description: 'Piso donde se encuentra la ubicación',
    example: 'Piso 2',
  })
  @Expose()
  floor: string

  @ApiProperty({
    description: 'Referencia adicional de la ubicación',
    example: 'Cerca del elevador',
  })
  @Expose()
  reference: string

  @ApiProperty({
    description: 'Capacidad de la ubicación',
    example: 100,
  })
  @Expose()
  capacity: number

  @ApiProperty({
    description: 'Unidad de capacidad de la ubicación',
    example: 'Cajas',
  })
  @Expose()
  capacityUnit: string

  @ApiProperty({
    description: 'Ocupación actual de la ubicación',
    example: 50,
  })
  @Expose()
  occupancy: number

  @ApiProperty({
    description: 'Código QR de la ubicación',
    example: 'QR12345',
  })
  @Expose()
  qrCode: string

  @ApiProperty({
    description: 'Coordenadas de la ubicación',
    example: '19.432608, -99.133209',
  })
  @Expose()
  coordinates: string

  @ApiProperty({
    description: 'Notas adicionales sobre la ubicación',
    example: 'Revisar periódicamente',
  })
  @Expose()
  notes: string

  @Exclude()
  active: boolean

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
