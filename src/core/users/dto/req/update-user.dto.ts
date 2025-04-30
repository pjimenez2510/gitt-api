import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'userName (must be unique)',
    example: 'johndoe',
  })
  @IsString({ message: 'userName must be a string' })
  @IsNotEmpty({ message: 'userName is required' })
  userName?: string

  @ApiPropertyOptional({
    description: 'email (must be unique)',
    example: 'johndoe@test.com',
  })
  @IsString({ message: 'password must be a string' })
  password?: string
}
