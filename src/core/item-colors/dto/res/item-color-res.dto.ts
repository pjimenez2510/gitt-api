import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class ItemColorResDto {
  @ApiProperty({
    description: 'id única de la combinacion de color e item',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'id del item',
    example: 2,
  })
  @Expose()
  itemId: number

  @ApiProperty({
    description: 'id del color del ítem',
    example: 1,
  })
  @Expose()
  colorId: number

  @ApiProperty({
    description: 'La combinación es principal?',
    example: true,
  })
  @Expose()
  isMainColor: boolean

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
