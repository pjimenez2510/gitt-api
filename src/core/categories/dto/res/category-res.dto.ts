import { ApiProperty } from '@nestjs/swagger'

export class CategoryResDto {
  @ApiProperty({
    description: 'id of the category',
    example: 'asdasd-asdasd-asdasd-asdasd',
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
    description: 'parentCategoryId of the category',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  parentCategoryId: number

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
