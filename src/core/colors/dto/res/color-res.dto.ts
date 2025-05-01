import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class ColorResDto {
  @ApiProperty({
    description: 'id del color',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  @Expose()
  id: string

  @ApiProperty({
    description: 'nombre del color',
    example: 'Rojo',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'código hexadecimal del color',
    example: '#FF0000',
  })
  @Expose()
  hexCode: string

  @ApiProperty({
    description: 'descripción del color',
    example: 'Color rojo brillante',
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
