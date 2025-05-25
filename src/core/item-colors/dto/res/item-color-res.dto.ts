import { ApiProperty } from '@nestjs/swagger'
import { ColorResDto } from 'src/core/colors/dto/res/color-res.dto'

export class ItemColorResDto {
  @ApiProperty({
    description: 'id única de la combinacion de color e item',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'id del item',
    example: 2,
  })
  itemId: number

  @ApiProperty({
    description: 'La combinación es principal?',
    example: true,
  })
  isMainColor: boolean

  @ApiProperty({
    description: 'Color del ítem',
  })
  color: ColorResDto
}
