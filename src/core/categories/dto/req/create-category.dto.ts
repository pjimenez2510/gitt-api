import { ApiProperty } from '@nestjs/swagger'
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'code (must be unique)',
    example: 'CAT001',
  })
  @IsString({ message: 'code must be a string' })
  @IsNotEmpty({ message: 'code is required' })
  code: string

  @ApiProperty({
    description: 'name (is required)',
    example: 'Electronics',
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
    description: 'parentCategoryId (is optional)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  parentCategoryId?: number

  @ApiProperty({
    description: 'standardUsefulLife (is optional)',
    example: 5,
  })
  @IsInt({ message: 'standardUsefulLife must be a integer' })
  @IsOptional()
  standardUsefulLife?: number

  @ApiProperty({
    description: 'depreciationPercentage (is optional)',
    example: '999.99',
  })
  @IsDecimal(
    { decimal_digits: '0,2' },
    {
      message:
        'depreciationPercentage must be a decimal with up to 2 decimal places',
    },
  )
  @IsOptional()
  depreciationPercentage?: string
}
