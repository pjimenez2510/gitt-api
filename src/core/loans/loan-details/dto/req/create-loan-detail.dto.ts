import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateLoanDetailDto {
  @ApiProperty({
    description: 'ID del item a prestar',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  itemId: number

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
