/*
 {
  "code": "CAT001",
  "name": "Electronics",
  "description": "Category for electronic items",
  "parentCategoryId": "123e4567-e89b-12d3-a456-426614174000",
  "standardUsefulLife": 5,
  "depreciationPercentage": 10.00,
  "active": true
}
     */
import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateCategoryDto } from './create-category.dto'

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    description: 'code (must be unique)',
    example: 'CAT001',
  })
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code is required' })
  code?: string

  @ApiPropertyOptional({
    description: 'name (is required)',
    example: 'Electronics',
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

  @ApiPropertyOptional({
    description: 'parentCategoryId (is optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  parentCategoryId?: string

  @ApiPropertyOptional({
    description: 'standardUsefulLife (is optional)',
    example: '5',
  })
  standardUsefulLife?: number

  @ApiPropertyOptional({
    description: 'depreciationPercentage (is optional)',
    example: '999.99',
  })
  depreciationPercentage?: string

  @IsOptional()
  updateDate?: Date = new Date()
}
