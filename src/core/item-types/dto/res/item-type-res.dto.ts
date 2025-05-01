import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class ItemTypeResDto {
  @ApiProperty({
    description: 'id del tipo de ítem',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  @Expose()
  id: string

  @ApiProperty({
    description: 'código del tipo de ítem',
    example: 'IT001',
  })
  @Expose()
  code: string

  @ApiProperty({
    description: 'nombre del tipo de ítem',
    example: 'Mobiliario',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'descripción del tipo de ítem',
    example: 'Tipo para muebles y enseres',
  })
  @Expose()
  description: string

  @Exclude()
  active: boolean

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
