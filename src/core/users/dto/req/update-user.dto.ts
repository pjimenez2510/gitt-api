import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreateUserDto } from './create-user.dto'
import { Type } from 'class-transformer'
import { USER_TYPE } from '../../types/user-type.enum'
import { UpdatePersonDto } from 'src/core/people/dto/req/update-person.dto'
import { USER_STATUS } from '../../types/user-status.enum'

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['person']),
) {
  @ApiPropertyOptional({
    description: 'userName (must be unique)',
    example: 'johndoe',
  })
  @IsString({ message: 'userName must be a string' })
  @IsOptional()
  userName?: string

  @ApiPropertyOptional({
    description: 'email (must be unique)',
    example: 'johndoe@test.com',
  })
  @IsString({ message: 'password must be a string' })
  @IsOptional()
  password?: string

  @ApiPropertyOptional({
    description: 'career of the user',
    example: 'Software Engineer',
  })
  @IsString({ message: 'career must be a string' })
  @IsNotEmpty({ message: 'career is required' })
  @IsOptional()
  career?: string

  @ApiPropertyOptional({
    description: 'user type of the user',
    example: USER_TYPE.ADMINISTRATOR,
    enum: USER_TYPE,
  })
  @IsEnum(USER_TYPE)
  @IsOptional()
  userType?: USER_TYPE

  @ApiPropertyOptional({
    description: 'status of the user',
    example: USER_STATUS.ACTIVE,
    enum: USER_STATUS,
  })
  @IsEnum(USER_STATUS)
  @IsOptional()
  status?: USER_STATUS

  @ApiPropertyOptional({
    description: 'person associated with the user',
    type: UpdatePersonDto,
  })
  @Type(() => UpdatePersonDto)
  @ValidateNested()
  @IsOptional()
  person?: UpdatePersonDto
}
