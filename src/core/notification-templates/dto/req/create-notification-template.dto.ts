import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { notificationType } from 'drizzle/schema'

export class CreateNotificationTemplateDto {
  @ApiProperty({
    description: 'Tipo de plantilla',
    example: 'LOAN',
    // enum: notificationType,
  })
  // @IsEnum(notificationType)
  @IsNotEmpty()
  type: 'LOAN' | 'RETURN' | 'MAINTENANCE' | 'SYSTEM' | 'EXPIRATION'

  @ApiProperty({
    description: 'Título de la plantilla',
    example: 'Plantilla de préstamo',
  })
  @IsString()
  @IsNotEmpty()
  templateTitle: string

  @ApiProperty({
    description: 'Contenido de la plantilla',
    example: 'Contenido de la plantilla',
  })
  @IsString()
  @IsNotEmpty()
  templateContent: string

  @ApiPropertyOptional({
    description: 'Canal de la plantilla',
    example: 'EMAIL',
  })
  @IsString()
  @IsOptional()
  channels?: ('EMAIL' | 'MOBILE' | 'SYSTEM')[]
}
