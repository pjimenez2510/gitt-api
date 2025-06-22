import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { PERSON_TYPE } from '../../types/person-type.enum'

export class CreatePersonDto {
  @ApiProperty({
    description: 'Person dni (must be unique)',
    example: '0707047643',
  })
  @IsString()
  dni: string

  @ApiProperty({
    description: 'Person first name',
    example: 'Juan',
  })
  @IsString()
  firstName: string

  @ApiProperty({
    description: 'Person last name',
    example: 'Pérez',
  })
  @IsString()
  lastName: string

  @ApiProperty({
    description: 'Email of the person (must be unique)',
    example: 'jperez1231@uta.edu.ec',
  })
  @IsEmail()
  email: string

  @ApiPropertyOptional({
    description: 'Phone number of the person',
    example: '0987654321',
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({
    description: 'Type of the person (ESTUDIANTES o DOCENTES)',
    example: PERSON_TYPE.STUDENT,
    enum: PERSON_TYPE,
  })
  @IsEnum(PERSON_TYPE)
  type: PERSON_TYPE
}
