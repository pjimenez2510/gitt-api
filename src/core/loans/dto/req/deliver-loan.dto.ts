import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class DeliverLoanDto {
  @ApiProperty({
    description: 'Fecha de entrega del préstamo',
    example: '2023-10-01T12:00:00Z',
  })
  @IsDate({
    message: 'La fecha de entrega debe ser una fecha válida',
  })
  @Type(() => Date)
  @IsNotEmpty()
  deliveryDate: Date

  @ApiProperty({
    description: 'Notas adicionales para la entrega (opcional)',
    example: 'Entregado con todas las verificaciones completadas',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string
}
