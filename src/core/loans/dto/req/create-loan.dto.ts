import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateLoanDetailDto } from '../../loan-details/dto/req/create-loan-detail.dto'

export class CreateLoanDto {
  @ApiProperty({
    description: 'Fecha programada de devolución',
    example: '2023-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsNotEmpty()
  scheduledReturnDate: string

  @ApiProperty({
    description: 'ID del solicitante del préstamo',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  requestorId: number

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
}
