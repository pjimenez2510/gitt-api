import { ApiProperty } from '@nestjs/swagger'

export class MaterialResDto {
  @ApiProperty({
    description: 'id del material',
    example: 'asdasd-asdasd-asdasd-asdasd',
  })
  id: number

  @ApiProperty({
    description: 'nombre del material',
    example: 'Madera',
  })
  name: string

  @ApiProperty({
    description: 'descripción del material',
    example: 'Material de madera para muebles',
  })
  description: string

  @ApiProperty({
    description: 'tipo de material',
    example: 'Natural',
  })
  materialType: string
}
