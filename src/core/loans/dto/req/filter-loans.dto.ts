import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export enum LoanStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class FilterLoansDto extends BaseParamsDto {
  @ApiProperty({
    description: 'Estado del préstamo a filtrar',
    enum: LoanStatus,
    required: false,
  })
  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus

  @ApiProperty({
    description: 'DNI del solicitante para filtrar por usuario',
    example: '12345678A',
    required: false,
  })
  @IsString()
  @IsOptional()
  requestorDni?: string

  @ApiProperty({
    description: 'Fecha de inicio para filtrar préstamos (ISO string)',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  fromDate?: string

  @ApiProperty({
    description: 'Fecha de fin para filtrar préstamos (ISO string)',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  toDate?: string
}
