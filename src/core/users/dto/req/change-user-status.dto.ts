import { IsEnum, IsNotEmpty } from 'class-validator'
import { USER_STATUS } from '../../types/user-status.enum'
import { ApiProperty } from '@nestjs/swagger'

export class ChangeUserStatusDto {
  @ApiProperty({
    description: 'Status of the user',
    example: USER_STATUS.ACTIVE,
    enum: USER_STATUS,
  })
  @IsNotEmpty()
  @IsEnum(USER_STATUS)
  status: USER_STATUS
}
