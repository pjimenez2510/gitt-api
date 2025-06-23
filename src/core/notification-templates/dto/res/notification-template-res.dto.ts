import { ApiProperty } from '@nestjs/swagger'
import { notificationType } from 'drizzle/schema'

export class NotificationTemplateResDto {
  @ApiProperty({
    description: 'id de la plantilla',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'tipo de plantilla',
    example: 'LOAN',
    enum: notificationType,
  })
  type: 'LOAN' | 'RETURN' | 'MAINTENANCE' | 'SYSTEM' | 'EXPIRATION'

  @ApiProperty({
    description: 'título de la plantilla',
    example: 'Plantilla de préstamo',
  })
  templateTitle: string

  @ApiProperty({
    description: 'contenido de la plantilla',
    example: 'Contenido de la plantilla',
  })
  templateContent: string

  @ApiProperty({
    description: 'canal de la plantilla',
    example: 'EMAIL',
  })
  channels: string[]
}
