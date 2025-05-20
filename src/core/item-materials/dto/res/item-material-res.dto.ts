import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class ItemMaterialResDto {
  @ApiProperty({
    description: 'id única de la combinacion de material e item',
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
    description: 'id del material del ítem',
    example: 1,
  })
  @Expose()
  materialId: number

  @ApiProperty({
    description: 'el material es principal?',
    example: true,
  })
  @Expose()
  isMainMaterial: boolean

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
