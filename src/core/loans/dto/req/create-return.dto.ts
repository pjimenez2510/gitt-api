import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'

class ReturnItemDto {
  @ApiProperty({
    description: 'ID del detalle del préstamo',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del detalle debe ser un número' })
  @IsNotEmpty({ message: 'El ID del detalle es requerido' })
  loanDetailId: number

  @ApiProperty({
    description: 'ID de la condición de retorno',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la condición debe ser un número' })
  @IsNotEmpty({ message: 'El ID de la condición es requerido' })
  returnConditionId: number

  @ApiProperty({
    description: 'Observaciones sobre el retorno del ítem',
    example: 'El ítem fue devuelto con algunos rasguños en la superficie',
  })
  @IsOptional()
  returnObservations?: string
}

export class CreateReturnLoanDto {
  @ApiProperty({
    description: 'ID del préstamo a devolver',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del préstamo debe ser un número' })
  @IsNotEmpty({ message: 'El ID del préstamo es requerido' })
  loanId: number

  @ApiProperty({
    description: 'Fecha de devolución actual',
    example: '2025-05-19T14:30:00Z',
  })
  @IsDateString(
    {},
    { message: 'La fecha de devolución debe ser una fecha válida' },
  )
  @IsNotEmpty({ message: 'La fecha de devolución es requerida' })
  actualReturnDate: string

  @ApiProperty({
    description: 'Detalles de los ítems devueltos',
    type: [ReturnItemDto],
  })
  @IsArray({ message: 'Los ítems devueltos deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un ítem para devolver' })
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  returnedItems: ReturnItemDto[]

  @ApiProperty({
    description: 'Observaciones generales sobre la devolución',
    example: 'La devolución se realizó con algunos días de retraso',
  })
  @IsOptional()
  notes?: string
}
