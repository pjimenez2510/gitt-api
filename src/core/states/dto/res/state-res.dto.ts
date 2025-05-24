import { ApiProperty } from '@nestjs/swagger'

export class StateResDto {
  @ApiProperty({
    description: 'id del estado',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'nombre del estado',
    example: 'Activo',
  })
  name: string

  @ApiProperty({
    description: 'descripción del estado',
    example: 'Estado que indica que el ítem está activo y disponible',
  })
  description: string
}
