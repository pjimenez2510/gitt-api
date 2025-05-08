import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PersonResDto } from 'src/core/people/dto/res/person-res.dto'
import { USER_STATUS } from '../../types/user-status.enum'
import { USER_TYPE } from '../../types/user-type.enum'

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

  @ApiPropertyOptional({
    description: 'career of the user',
    example: 'Software Engineer',
  })
  career: string | null

  @ApiProperty({
    description: 'user type of the user',
    example: USER_TYPE.ADMINISTRATOR,
  })
  userType: USER_TYPE

  @ApiProperty({
    description: 'status of the user',
    example: USER_STATUS.ACTIVE,
    enum: USER_STATUS,
  })
  status: USER_STATUS

  @ApiProperty({
    description: 'person of the user',
    type: () => PersonResDto,
  })
  person: PersonResDto
}
