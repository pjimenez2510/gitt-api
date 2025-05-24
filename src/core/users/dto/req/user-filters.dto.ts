import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { USER_STATUS } from '../../types/user-status.enum'
import { USER_TYPE } from '../../types/user-type.enum'

export class UserFiltersDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Nombre de usuario (búsqueda parcial)',
  })
  userName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'DNI del usuario',
  })
  dni?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Email del usuario (búsqueda parcial)',
  })
  email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Carrera del usuario (búsqueda parcial)',
  })
  career?: string

  @IsOptional()
  @IsEnum(USER_TYPE, {
    message:
      'El tipo de usuario debe ser uno de los siguientes valores: ' +
      Object.values(USER_TYPE).join(', '),
  })
  @ApiPropertyOptional({
    description: 'Tipo de usuario',
    enum: USER_TYPE,
  })
  userType?: USER_TYPE

  @IsOptional()
  @IsEnum(USER_STATUS, {
    message:
      'El estado debe ser uno de los siguientes valores: ' +
      Object.values(USER_STATUS).join(', '),
  })
  @ApiPropertyOptional({
    description: 'Estado del usuario',
    enum: USER_STATUS,
  })
  status?: USER_STATUS
}
