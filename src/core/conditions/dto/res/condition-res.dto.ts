import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class ConditionResDto {
  @ApiProperty({
    description: 'id de la condición',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  @Expose()
  id: string

  @ApiProperty({
    description: 'nombre de la condición',
    example: 'Nuevo',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'descripción de la condición',
    example: 'Condición para ítems nuevos sin uso',
  })
  @Expose()
  description: string

  @ApiProperty({
    description: 'requiere mantenimiento',
    example: false,
  })
  @Expose()
  requiresMaintenance: boolean

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date

  @Exclude()
  active: boolean
}
