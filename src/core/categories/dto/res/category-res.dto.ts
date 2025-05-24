import { ApiProperty } from '@nestjs/swagger'

export class CategoryResDto {
  @ApiProperty({
    description: 'id of the category',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'code of the category',
    example: 'CAT-001',
  })
  code: string

  @ApiProperty({
    description: 'name of the category',
    example: 'Electronics',
  })
  name: string

  @ApiProperty({
    description: 'description of the category',
    example: 'Electronics and gadgets',
  })
  description: string

  @ApiProperty({
    description: 'parentCategory of the category',
  })
  parentCategory?: CategoryResDto

  @ApiProperty({
    description: 'standardUsefulLife of the category',
    example: 5,
  })
  standardUsefulLife: number

  @ApiProperty({
    description: 'depreciationPercentage of the category',
    example: 10.5,
  })
  depreciationPercentage: number
}
