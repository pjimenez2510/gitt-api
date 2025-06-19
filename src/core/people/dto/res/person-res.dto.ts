import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PERSON_STATUS } from '../../types/person-status.enum'
import { PERSON_TYPE } from '../../types/person-type.enum'

export class PersonResDto {
  @ApiProperty({
    description: 'ID de la persona',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'DNI de la persona',
    example: '0707047643',
  })
  dni: string

  @ApiProperty({
    description: 'Nombre de la persona',
    example: 'Juan',
  })
  firstName: string

  @ApiPropertyOptional({
    description: 'Segundo nombre de la persona',
    example: 'Pablo',
  })
  middleName: string | null

  @ApiProperty({
    description: 'Apellido de la persona',
    example: 'Pérez',
  })
  lastName: string

  @ApiPropertyOptional({
    description: 'Segundo apellido de la persona',
    example: 'González',
  })
  secondLastName: string | null

  @ApiProperty({
    description: 'Email de la persona',
    example: 'jperez1231@uta.edu.ec',
  })
  email: string

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento de la persona',
    example: '1990-01-01',
  })
  birthDate: Date | null

  @ApiPropertyOptional({
    description: 'Teléfono de la persona',
    example: '0987654321',
  })
  phone: string | null

  @ApiProperty({
    description: 'Tipo de persona',
    example: PERSON_TYPE.STUDENT,
    enum: PERSON_TYPE,
  })
  type: PERSON_TYPE

  @ApiProperty({
    description: 'Estado de la persona',
    example: PERSON_STATUS.ACTIVE,
    enum: PERSON_STATUS,
  })
  status: PERSON_STATUS
}
