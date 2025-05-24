import { ApiProperty } from '@nestjs/swagger'
import { MaterialResDto } from 'src/core/materials/dto/res/material-res.dto'

export class ItemMaterialResDto {
  @ApiProperty({
    description: 'id única de la combinacion de material e item',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'id del item',
    example: 2,
  })
  itemId: number

  @ApiProperty({
    description: 'id del material del ítem',
    example: 1,
  })
  materialId: number

  @ApiProperty({
    description: 'el material es principal?',
    example: true,
  })
  isMainMaterial: boolean

  @ApiProperty({
    description: 'Material del ítem',
  })
  material: MaterialResDto
}
