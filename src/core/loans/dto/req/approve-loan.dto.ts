import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class ApproveLoanDto {
  @ApiProperty({
    description: 'Notas adicionales para la aprobación (opcional)',
    example: 'Aprobado con observaciones sobre el cuidado del equipo',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string
}
