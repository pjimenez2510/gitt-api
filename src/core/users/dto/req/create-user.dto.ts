import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreatePersonDto } from 'src/core/people/dto/req/create-person.dto'
import { USER_TYPE } from '../../types/user-type.enum'
import { USER_STATUS } from '../../types/user-status.enum'

export class CreateUserDto {
  @ApiProperty({
    description: 'userName (must be unique)',
    example: 'johndoe',
  })
  @IsString({ message: 'userName must be a string' })
  @IsNotEmpty({ message: 'userName is required' })
  userName: string

  @ApiProperty({
    description: 'password of the user',
    example: '123456',
  })
  @IsString({ message: 'password must be a string' })
  password: string

  @ApiPropertyOptional({
    description: 'career of the user',
    example: 'Software Engineer',
  })
  @IsString({ message: 'career must be a string' })
  @IsOptional()
  career?: string

  @ApiProperty({
    description: 'user type of the user',
    example: USER_TYPE.ADMINISTRATOR,
    enum: USER_TYPE,
  })
  @IsEnum(USER_TYPE)
  userType: USER_TYPE

  @ApiPropertyOptional({
    description: 'status of the user',
    example: USER_STATUS.ACTIVE,
    enum: USER_STATUS,
    default: USER_STATUS.ACTIVE,
  })
  @IsEnum(USER_STATUS)
  @IsOptional()
  status?: USER_STATUS

  @ApiProperty({
    description: 'person associated with the user',
    type: CreatePersonDto,
  })
  @Type(() => CreatePersonDto)
  @ValidateNested()
  @IsNotEmpty({ message: 'person is required' })
  person: CreatePersonDto
}
