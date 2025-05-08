import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { CreateItemColorDto } from './create-item-color.dto'

export class UpdateItemColorDto extends PartialType(CreateItemColorDto) {
  @ApiPropertyOptional({
    description: 'colorId (es opcional)',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'colorId debe ser un entero' })
  colorId?: number

  @ApiPropertyOptional({
    description: 'isMainColor (es opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'isMainColor debe ser un booleano' })
  @IsOptional()
  isMainColor?: boolean = true

  @IsOptional()
  updateDate?: Date = new Date()
}
