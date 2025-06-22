import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class CreateLoanDetailDto {
  @ApiProperty({
    description: 'ID del item a prestar',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  itemId: number

  @ApiProperty({
    description: 'Cantidad de unidades del item a prestar',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    description: 'ID de la condición de salida del item',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  exitConditionId?: number

  @ApiProperty({
    description: 'Observaciones de la salida del item',
    example: 'Item en buen estado',
    required: false,
  })
  @IsString()
  @IsOptional()
  exitObservations?: string
}
