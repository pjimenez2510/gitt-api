import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class MarkAsDefaulterDto {
  @ApiProperty({
    description: 'ID de la persona (opcional si se proporciona DNI)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  personId?: number

  @ApiProperty({
    description: 'DNI de la persona (opcional si se proporciona ID)',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  dni?: string
} 