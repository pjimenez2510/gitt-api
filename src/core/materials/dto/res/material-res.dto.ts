import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class MaterialResDto {
  @ApiProperty({
    description: 'id del material',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  @Expose()
  id: string

  @ApiProperty({
    description: 'nombre del material',
    example: 'Madera',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'descripción del material',
    example: 'Material de madera para muebles',
  })
  @Expose()
  description: string

  @ApiProperty({
    description: 'tipo de material',
    example: 'Natural',
  })
  @Expose()
  materialType: string

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date

  @Exclude()
  active: boolean
}
