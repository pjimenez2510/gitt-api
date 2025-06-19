import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateLoanDetailDto } from '../../loan-details/dto/req/create-loan-detail.dto'

export class CreateLoanDto {
  @ApiProperty({
    description: 'Fecha programada de devolución',
    example: '2023-12-31T23:59:59Z',
  })
  @IsDate({
    message: 'La fecha de devolución programada debe ser una fecha válida',
  })
  @Type(() => Date)
  @IsNotEmpty()
  scheduledReturnDate: Date

  @ApiProperty({
    description:
      'DNI del solicitante del préstamo (debe tener 10 o 13 caracteres)',
    example: '1804822748',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}([0-9]{3})?$/, {
    message: 'El DNI debe tener 10 o 13 dígitos numéricos',
  })
  requestorId: string

  @ApiProperty({
    description: 'Motivo del préstamo',
    example: 'Clase de laboratorio',
  })
  @IsString()
  @IsNotEmpty()
  reason: string

  @ApiProperty({
    description: 'Evento asociado al préstamo (opcional)',
    example: 'Feria de ciencias',
    required: false,
  })
  @IsString()
  @IsOptional()
  associatedEvent?: string

  @ApiProperty({
    description: 'Ubicación externa donde se utilizarán los items (opcional)',
    example: 'Laboratorio central',
    required: false,
  })
  @IsString()
  @IsOptional()
  externalLocation?: string

  @ApiProperty({
    description: 'Notas adicionales (opcional)',
    example: 'Se requiere cuidado especial con el equipo',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string

  @ApiProperty({
    description: 'Detalles de los items incluidos en el préstamo',
    type: [CreateLoanDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLoanDetailDto)
  @IsNotEmpty()
  loanDetails: CreateLoanDetailDto[]

  @ApiProperty({
    description:
      'Indica si el préstamo está bloqueado (opcional), falso si se quiere permitir préstamos a usuarios con estado DEFAULTER, INACTIVE o SUSPENDED',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  blockBlackListed?: boolean = true
}
