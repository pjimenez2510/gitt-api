import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    description: 'email',
    example: 'ezhu7643@uta.edu.ec',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string

  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsString({ message: 'password must be a string' })
  @Length(6, 20, { message: 'password must be between 4 and 20 characters' })
  password: string
}
