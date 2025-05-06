import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateStatusDto {
  @ApiProperty({
    description: 'name (must be unique)',
    example: 'New',
  })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string

  @ApiProperty({
    description: 'description (is optional)',
    example: 'Category for electronic items',
  })
  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'requiresMaintenance (is optional)',
    example: 'false',
  })
  @IsBoolean({ message: 'requiresMaintenance must be a boolean' })
  @IsOptional()
  requiresMaintenance?: boolean
}
