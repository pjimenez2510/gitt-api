import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'userName (must be unique)',
    example: 'johndoe',
  })
  @IsString({ message: 'userName must be a string' })
  @IsNotEmpty({ message: 'userName is required' })
  userName: string

  @ApiProperty({
    description: 'email (must be unique)',
    example: 'johndoe@test.com',
  })
  @IsString({ message: 'password must be a string' })
  password: string
}
