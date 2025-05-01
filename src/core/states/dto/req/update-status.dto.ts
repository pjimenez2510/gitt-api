import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateStatusDto } from './create-status.dto'

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
  @ApiPropertyOptional({
    description: 'name (must be unique)',
    example: 'New',
  })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name?: string

  @ApiPropertyOptional({
    description: 'description (is optional)',
    example: 'Category for electronic items',
  })
  @IsString({ message: 'description must be a string' })
  description?: string

  @IsOptional()
  updateDate?: Date = new Date()
}
