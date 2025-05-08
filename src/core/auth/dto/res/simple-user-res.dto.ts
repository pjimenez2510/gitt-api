import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class SimpleUserResDto {
  @ApiProperty({
    description: 'id del usuario',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'username del usuario',
    example: 'ezhu7643',
  })
  @Expose()
  username: string

  @ApiProperty({
    description: 'tipo de usuario',
    example: 'ADMINISTRATOR',
  })
  @Expose()
  userType: string

  @ApiProperty({
    description: 'estado del usuario',
    example: 'ACTIVE',
  })
  @Expose()
  status: string

  @ApiProperty({
    description: 'carrera del usuario',
    example: 'Ingeniería en Sistemas',
  })
  @Expose()
  career: string

  @ApiProperty({
    description: 'id de la persona',
    example: 1,
  })
  @Expose()
  personId: number
}
