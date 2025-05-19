import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { CreateItemMaterialDto } from './create-item-material.dto'

export class UpdateItemMaterialDto extends PartialType(CreateItemMaterialDto) {
  @ApiPropertyOptional({
    description: 'materialId (es opcional)',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'materialId debe ser un entero' })
  materialId?: number

  @ApiPropertyOptional({
    description: 'isMainMaterial (es opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'isMainMaterial debe ser un booleano' })
  @IsOptional()
  isMainMaterial?: boolean = true

  @IsOptional()
  updateDate?: Date = new Date()
}
