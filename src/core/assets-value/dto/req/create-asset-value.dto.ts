import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDecimal,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator'

export class CreateAssetValueDto {
  @ApiProperty({
    description: 'itemId (must be unique)',
    example: 1,
  })
  @IsInt({ message: 'itemId must be a integer' })
  @IsNotEmpty({ message: 'itemId is required' })
  itemId: number

  @ApiPropertyOptional({
    description: 'currency (default is USD)',
    example: 'USD',
  })
  @IsString({ message: 'currency must be a string' })
  @IsOptional()
  currency?: string

  @ApiProperty({
    description: 'purchaseValue (is required)',
    example: '9999999999.99',
  })
  @IsDecimal(
    { decimal_digits: '0,2' },
    {
      message: 'purchaseValue must be a decimal with up to 2 decimal places',
    },
  )
  @IsNotEmpty({ message: 'purchaseValue is required' })
  purchaseValue: string

  @ApiPropertyOptional({
    description: 'repurchase (is optional)',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'repurchase must be a boolean' })
  repurchase?: boolean

  @ApiPropertyOptional({
    description: 'depreciable (is optional)',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'depreciable must be a boolean' })
  depreciable?: boolean

  @ApiProperty({
    description: 'entryDate (is required yyyy-mm-dd)',
    example: '2023-10-01',
  })
  @IsDateString({ strict: true }, { message: 'entryDate must be a date' })
  @IsNotEmpty({ message: 'entryDate is required' })
  entryDate: string

  @ApiPropertyOptional({
    description: 'usefulLife (is optional)',
    example: 5,
  })
  @IsInt({ message: 'usefulLife must be a integer' })
  @IsOptional()
  usefulLife?: number

  @ApiPropertyOptional({
    description: 'depreciationEndDate (is optional yyyy-mm-dd)',
    example: '2023-10-01',
  })
  @IsDateString(
    { strict: true },
    { message: 'depreciationEndDate must be a date' },
  )
  @IsOptional()
  depreciationEndDate?: string

  @ApiPropertyOptional({
    description: 'bookValue (is optional)',
    example: '9999999999.99',
  })
  @IsDecimal(
    { decimal_digits: '0,2' },
    {
      message: 'bookValue must be a decimal with up to 2 decimal places',
    },
  )
  @IsOptional()
  bookValue?: string

  @ApiPropertyOptional({
    description: 'residualValue (is optional)',
    example: '9999999999.99',
  })
  @IsDecimal(
    { decimal_digits: '0,2' },
    {
      message: 'residualValue must be a decimal with up to 2 decimal places',
    },
  )
  @IsOptional()
  residualValue?: string

  @ApiPropertyOptional({
    description: 'ledgerValue (is optional)',
    example: '9999999999.99',
  })
  @IsDecimal(
    { decimal_digits: '0,2' },
    {
      message: 'ledgerValue must be a decimal with up to 2 decimal places',
    },
  )
  @IsOptional()
  ledgerValue?: string
}
