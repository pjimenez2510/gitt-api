import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateItemTypeDto {
  @ApiProperty({
    description: 'código (debe ser único)',
    example: 'IT001',
  })
  @IsString({ message: 'El código debe ser un string' })
  @IsNotEmpty({ message: 'El código es requerido' })
  code: string

  @ApiProperty({
    description: 'nombre (es requerido)',
    example: 'Mobiliario',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string

  @ApiProperty({
    description: 'descripción (es opcional)',
    example: 'Tipo para muebles y enseres',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'activo (es opcional)',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'activo debe ser un booleano' })
  @IsOptional()
  active?: boolean = true
}
