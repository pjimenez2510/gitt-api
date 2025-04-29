import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString({ message: 'userName must be a string' })
  @IsNotEmpty({ message: 'userName is required' })
  userName: string

  @IsString({ message: 'password must be a string' })
  password: string
}
