import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateConditionDto } from './create-condition.dto'

export class UpdateConditionDto extends PartialType(CreateConditionDto) {
  @ApiPropertyOptional({
    description: 'nombre de la condición (debe ser único)',
    example: 'Usado',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name?: string

  @ApiPropertyOptional({
    description: 'descripción (es opcional)',
    example: 'Condición para ítems usados en buen estado',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string

  @ApiPropertyOptional({
    description: 'requiere mantenimiento (es opcional)',
    example: true,
  })
  @IsBoolean({ message: 'requiresMaintenance debe ser un booleano' })
  @IsOptional()
  requiresMaintenance?: boolean

  @IsOptional()
  updateDate?: Date = new Date()
}
