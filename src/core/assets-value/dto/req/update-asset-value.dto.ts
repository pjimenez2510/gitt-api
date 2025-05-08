import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { CreateAssetValueDto } from './create-asset-value.dto'
import { IsString, IsOptional } from 'class-validator'

export class UpdateAssetValueDto extends PartialType(CreateAssetValueDto) {
  @ApiPropertyOptional({
    description: 'currency (default is USD)',
    example: 'USD',
  })
  @IsString({ message: 'currency must be a string' })
  @IsOptional()
  currency?: string

  @ApiPropertyOptional({
    description: 'repurchase (is optional)',
    example: true,
  })
  @IsOptional()
  repurchase?: boolean

  @ApiPropertyOptional({
    description: 'depreciable (is optional)',
    example: true,
  })
  @IsOptional()
  depreciable?: boolean

  @ApiPropertyOptional({
    description: 'lastDepreciationDate (is optional)',
    example: '2023-10-01',
  })
  @IsOptional()
  lastDepreciationDate?: Date

  @ApiPropertyOptional({
    description: 'bookValue (is optional)',
    example: '9999999999.99',
  })
  @IsOptional()
  bookValue?: string

  @ApiPropertyOptional({
    description: 'residualValue (is optional)',
    example: '9999999999.99',
  })
  @IsOptional()
  residualValue?: string

  @ApiPropertyOptional({
    description: 'ledgerValue (is optional)',
    example: '9999999999.99',
  })
  @IsOptional()
  ledgerValue?: string

  @ApiPropertyOptional({
    description: 'accumulatedDepreciationValue (is optional)',
    example: '9999999999.99',
  })
  @IsOptional()
  accumulatedDepreciationValue?: number

  @ApiPropertyOptional({
    description: 'onLoan (is optional)',
    example: true,
  })
  @IsOptional()
  onLoan?: boolean

  updateDate?: Date = new Date() // default to current date
}
