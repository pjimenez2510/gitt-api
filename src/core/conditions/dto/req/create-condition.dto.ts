import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateConditionDto {
  @ApiProperty({
    description: 'nombre de la condición (debe ser único)',
    example: 'Nuevo',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string

  @ApiProperty({
    description: 'descripción (es opcional)',
    example: 'Condición para ítems nuevos sin uso',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'requiere mantenimiento (es opcional)',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'requiresMaintenance debe ser un booleano' })
  @IsOptional()
  requiresMaintenance?: boolean = false
}
