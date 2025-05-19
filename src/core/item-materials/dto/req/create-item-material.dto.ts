import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateItemMaterialDto {
  @ApiProperty({
    description: 'itemId (es requerido)',
    example: 1,
  })
  @IsInt({ message: 'itemId debe ser un entero' })
  @IsNotEmpty({ message: 'itemId es requerido' })
  itemId: number

  @ApiProperty({
    description: 'materialId (es requerido)',
    example: 2,
  })
  @IsInt({ message: 'materialId debe ser un entero' })
  @IsNotEmpty({ message: 'materialId es requerido' })
  materialId: number

  @ApiPropertyOptional({
    description: 'isMainMaterial (es opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'isMainMaterial debe ser un booleano' })
  @IsOptional()
  isMainMaterial?: boolean
}
