import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class LoanDetailResDto {
  @ApiProperty({
    description: 'id única del detalle del prestamo',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'codigo unico del prestamo',
    example: 1,
  })
  @Expose()
  loanId: number

  @ApiProperty({
    description: 'id del item prestado',
    example: 1,
  })
  @Expose()
  itemId: Date

  @ApiProperty({
    description: 'id del estado de salida',
    example: 1,
  })
  @Expose()
  exitStatusId: number

  @ApiProperty({
    description: 'id del estado de devolucion',
    example: 1,
  })
  @Expose()
  returnStatusId: number

  @ApiProperty({
    description: 'observaciones de salida',
    example: 'observaciones de salida',
  })
  @Expose()
  exitObservations: string

  @ApiProperty({
    description: 'observaciones de devolucion',
    example: 'observaciones de devolucion',
  })
  @Expose()
  returnObservations: string

  @ApiProperty({
    description: 'imagen de salida',
    example: 'imagen de salida',
  })
  @Expose()
  exitImage: string

  @ApiProperty({
    description: 'imagen de devolucion',
    example: 'imagen de devolucion',
  })
  @Expose()
  returnImage: string

  @ApiProperty({
    description: 'aprobado',
    example: true,
  })
  @Expose()
  approved: boolean

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
