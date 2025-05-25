import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { LoanDetailResDto } from '../../loan-details/dto/res/loan-detail-res.dto'

export class LoanResDto {
  @ApiProperty({
    description: 'id única del prestamo',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'codigo unico del prestamo',
    example: 'PRESTAMO-001',
  })
  @Expose()
  loanCode: string

  @ApiProperty({
    description: 'Fecha de solicitud del prestamo',
    example: '2023-10-01T12:00:00Z',
  })
  @Expose()
  requestDate: Date

  @ApiProperty({
    description: 'Fecha de aprobacion del prestamo',
    example: '2023-10-01T12:00:00Z',
  })
  @Expose()
  approvalDate: Date

  @ApiProperty({
    description: 'Fecha de prestamo del item',
    example: '2023-10-01T12:00:00Z',
  })
  @Expose()
  deliveryDate: Date

  @ApiProperty({
    description: 'Fecha de devolucion programada del item',
    example: '2023-10-01T12:00:00Z',
  })
  @Expose()
  scheduledReturnDate: Date

  @ApiProperty({
    description: 'Fecha de devolucion real del item',
    example: '2023-10-01T12:00:00Z',
  })
  @Expose()
  actualReturnDate: Date

  @ApiProperty({
    description: 'Estado del prestamo',
    example: 'APPROVED',
    enumName: 'LoanStatus',
  })
  @Expose()
  status: string

  @ApiProperty({
    description: 'id del solicitante del prestamo',
    example: 2,
  })
  @Expose()
  requestorId: number

  @ApiProperty({
    description: 'id del aprobador del prestamo',
    example: 1,
  })
  @Expose()
  approverId: number

  @ApiProperty({
    description: 'Motivo del prestamo',
    example: 'Motivo de prueba',
  })
  @Expose()
  reason: string

  @ApiProperty({
    description: 'Evento asociado al prestamo',
    example: 'Evento de prueba',
  })
  @Expose()
  associatedEvent: string

  @ApiProperty({
    description: 'Ubicacion externa del prestamo',
    example: 'Ubicacion de prueba',
  })
  @Expose()
  externalLocation: string

  @ApiProperty({
    description: 'Notas del prestamo',
    example: 'Notas de prueba',
  })
  @Expose()
  notes: string

  @ApiProperty({
    description: 'Documento de responsabilidad del prestamo',
    example: 'Documento de prueba',
  })
  @Expose()
  responsibilityDocument: string

  @ApiProperty({
    description:
      'Indica si se ha enviado un recordatorio para la devolucion del prestamo',
    example: false,
  })
  @Expose()
  reminderSent: boolean

  @ApiProperty({
    description: 'Detalles del préstamo',
  })
  @Expose()
  loanDetails: LoanDetailResDto[]

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
