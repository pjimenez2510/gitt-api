import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateMaterialDto {
  @ApiProperty({
    description: 'nombre del material (debe ser único)',
    example: 'Madera',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string

  @ApiProperty({
    description: 'descripción (es opcional)',
    example: 'Material de madera para muebles',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'tipo de material (es opcional)',
    example: 'Natural',
  })
  @IsString({ message: 'El tipo de material debe ser un string' })
  @IsOptional()
  materialType?: string
}
