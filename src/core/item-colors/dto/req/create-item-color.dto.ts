import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateItemColorDto {
  @ApiProperty({
    description: 'itemId (es requerido)',
    example: 1,
  })
  @IsInt({ message: 'itemId debe ser un entero' })
  @IsNotEmpty({ message: 'itemId es requerido' })
  itemId: number

  @ApiProperty({
    description: 'colorId (es requerido)',
    example: 2,
  })
  @IsInt({ message: 'colorId debe ser un entero' })
  @IsNotEmpty({ message: 'colorId es requerido' })
  colorId: number

  @ApiPropertyOptional({
    description: 'isMainColor (es opcional)',
    example: true,
    default: false,
  })
  @IsBoolean({ message: 'isMainColor debe ser un booleano' })
  @IsOptional()
  isMainColor?: boolean
}
