import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { StatusLoan } from '../../enums/status-loan'

export class FilterLoansDto extends BaseParamsDto {
  @ApiProperty({
    description: 'Estado del préstamo a filtrar',
    enum: StatusLoan,
    required: false,
  })
  @IsEnum(StatusLoan)
  @IsOptional()
  status?: StatusLoan

  @ApiProperty({
    description: 'DNI del solicitante para filtrar por usuario',
    example: '12345678A',
    required: false,
  })
  @IsString()
  @IsOptional()
  requestorDni?: string
}
