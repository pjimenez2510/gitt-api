import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PERSON_STATUS } from '../../types/person-status.enum'
import { PERSON_TYPE } from '../../types/person-type.enum'

export class PersonFiltersDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'DNI de la persona',
  })
  dni?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Email de la persona (búsqueda parcial)',
  })
  email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre de la persona (búsqueda parcial)',
  })
  firstName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Apellido de la persona (búsqueda parcial)',
  })
  lastName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Teléfono de la persona (búsqueda parcial)',
  })
  phone?: string

  @IsOptional()
  @IsEnum(PERSON_TYPE, {
    message:
      'El tipo de persona debe ser uno de los siguientes valores: ' +
      Object.values(PERSON_TYPE).join(', '),
  })
  @ApiPropertyOptional({
    description: 'Tipo de persona',
    enum: PERSON_TYPE,
  })
  type?: PERSON_TYPE

  @IsOptional()
  @IsEnum(PERSON_STATUS, {
    message:
      'El estado debe ser uno de los siguientes valores: ' +
      Object.values(PERSON_STATUS).join(', '),
  })
  @ApiPropertyOptional({
    description: 'Estado de la persona',
    enum: PERSON_STATUS,
  })
  status?: PERSON_STATUS
}
