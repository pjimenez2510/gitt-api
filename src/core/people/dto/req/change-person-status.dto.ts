import { IsEnum, IsNotEmpty } from 'class-validator'
import { PERSON_STATUS } from '../../types/person-status.enum'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePersonStatusDto {
  @ApiProperty({
    description: 'Estado de la persona',
    example: PERSON_STATUS.ACTIVE,
    enum: PERSON_STATUS,
  })
  @IsNotEmpty()
  @IsEnum(PERSON_STATUS)
  status: PERSON_STATUS
}
