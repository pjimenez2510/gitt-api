import { ApiProperty } from '@nestjs/swagger'

export class StatusResDto {
  @ApiProperty({
    description: 'id of the status',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'name of the status',
    example: 'Electronics',
  })
  name: string

  @ApiProperty({
    description: 'description of the status',
    example: 'Electronics and gadgets',
  })
  description: string

  @ApiProperty({
    description: 'requiresMaintenance of the status',
    example: 5,
  })
  requiresMaintenance: boolean
}
