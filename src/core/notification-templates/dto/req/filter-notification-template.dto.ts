import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { notificationType } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class FilterNotificationTemplateDto extends BaseParamsDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda para tipo de plantilla',
    example: 'EMAIL',
    // enum: notificationType,
  })
  @IsOptional()
  @IsString()
  // @IsEnum(notificationType)
  type?: string

  @ApiPropertyOptional({
    description: 'Término de búsqueda para título de la plantilla',
  })
  @IsOptional()
  @IsString()
  templateTitle?: string

  @ApiPropertyOptional({
    description: 'Término de búsqueda para contenido de la plantilla',
  })
  @IsOptional()
  @IsString()
  templateContent?: string

  @ApiPropertyOptional({
    description: 'Término de búsqueda para tipo de canal',
  })
  @IsOptional()
  @IsString()
  channels?: string
}
