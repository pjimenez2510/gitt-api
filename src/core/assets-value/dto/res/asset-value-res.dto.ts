import { ApiProperty } from '@nestjs/swagger'

export class AssetValueResDto {
  @ApiProperty({
    description: 'id of the asset value',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'itemId of the asset value',
    example: 1,
  })
  itemId: number

  @ApiProperty({
    description: 'currency of the asset value',
    example: 'USD',
  })
  currency: string

  @ApiProperty({
    description: 'purchaseValue of the asset value',
    example: '9999999999.99',
  })
  purchaseValue: string

  @ApiProperty({
    description: 'repurchase of the asset value',
    example: true,
  })
  repurchase: boolean

  @ApiProperty({
    description: 'depreciable of the asset value',
    example: true,
  })
  depreciable: boolean

  @ApiProperty({
    description: 'entryDate of the asset value (yyyy-mm-dd)',
    example: '2023-10-01',
  })
  entryDate: string

  @ApiProperty({
    description: 'lastDepreciationDate of the asset value (yyyy-mm-dd)',
    example: '2023-10-01',
  })
  lastDepreciationDate: string

  @ApiProperty({
    description: 'usefulLife of the asset value',
    example: 5,
  })
  usefulLife: number

  @ApiProperty({
    description: 'depreciationEndDate of the asset value (yyyy-mm-dd)',
    example: '2023-10-01',
  })
  depreciationEndDate: string

  @ApiProperty({
    description: 'bookValue of the asset value',
    example: '9999999999.99',
  })
  bookValue: string

  @ApiProperty({
    description: 'residualValue of the asset value',
    example: '9999999999.99',
  })
  residualValue: string

  @ApiProperty({
    description: 'ledgerValue of the asset value',
    example: '9999999999.99',
  })
  ledgerValue: string

  @ApiProperty({
    description: 'accumulatedDepreciationValue of the asset value',
    example: '9999999999.99',
  })
  accumulatedDepreciationValue: string

  @ApiProperty({
    description: 'onLoan of the asset value',
    example: false,
  })
  onLoan: boolean
}
