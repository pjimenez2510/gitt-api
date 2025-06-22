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
    description: 'código único del préstamo',
    example: 1,
  })
  @Expose()
  loanId: number

  @ApiProperty({
    description: 'id del item prestado',
    example: 1,
  })
  @Expose()
  itemId: number

  @ApiProperty({
    description: 'cantidad de unidades prestadas',
    example: 5,
  })
  @Expose()
  quantity: number

  @ApiProperty({
    description: 'cantidad de unidades devueltas',
    example: 3,
  })
  @Expose()
  returnedQuantity: number

  @ApiProperty({
    description: 'id de la condición de salida',
    example: 1,
  })
  @Expose()
  exitConditionId: number

  @ApiProperty({
    description: 'id de la condición de devolución',
    example: 1,
  })
  @Expose()
  returnConditionId: number

  @ApiProperty({
    description: 'observaciones de salida',
    example: 'Item en buen estado',
  })
  @Expose()
  exitObservations: string

  @ApiProperty({
    description: 'observaciones de devolución',
    example: 'Item devuelto con rayones',
  })
  @Expose()
  returnObservations: string

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date
}
