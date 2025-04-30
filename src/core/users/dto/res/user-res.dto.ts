import { ApiProperty } from '@nestjs/swagger'

export class UserResDto {
  @ApiProperty({
    description: 'id of the user',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'userName of the user',
    example: 'johndoe',
  })
  userName: string
}
