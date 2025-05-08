import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean, IsInt, IsDate } from 'class-validator'
import { CreateCertificateDto } from './create-certificate.dto'

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {
  @ApiPropertyOptional({
    description: 'Certificate number (must be unique)',
    example: 12345,
  })
  @IsInt({ message: 'number must be an integer' })
  @IsOptional()
  number?: number

  @ApiPropertyOptional({
    description: 'Certificate date',
    example: '2023-01-01',
  })
  @IsString({ message: 'date must be a string' })
  @IsDate({ message: 'date must be a valid date' })
  @IsOptional()
  date?: string

  @ApiPropertyOptional({
    description: 'Certificate type',
    example: 'TYPE_A',
  })
  @IsString({ message: 'type must be a string' })
  @IsOptional()
  type?: string

  @ApiPropertyOptional({
    description: 'Certificate status',
    example: 'ACTIVE',
  })
  @IsString({ message: 'status must be a string' })
  @IsOptional()
  status?: string

  @ApiPropertyOptional({
    description: 'Delivery responsible user ID',
    example: 1,
  })
  @IsInt({ message: 'deliveryResponsibleId must be an integer' })
  @IsOptional()
  deliveryResponsibleId?: number

  @ApiPropertyOptional({
    description: 'Reception responsible user ID',
    example: 2,
  })
  @IsInt({ message: 'receptionResponsibleId must be an integer' })
  @IsOptional()
  receptionResponsibleId?: number

  @ApiPropertyOptional({
    description: 'Observations about the certificate',
    example: 'This is a sample observation.',
  })
  @IsString({ message: 'observations must be a string' })
  @IsOptional()
  observations?: string

  @ApiPropertyOptional({
    description: 'Whether the certificate is accounted',
    example: true,
  })
  @IsBoolean({ message: 'accounted must be a boolean' })
  @IsOptional()
  accounted?: boolean

  @ApiPropertyOptional({
    description: 'Registration date of the certificate',
    example: '2023-01-01T00:00:00Z',
  })
  @IsDate({ message: 'registrationDate must be a valid date' })
  @IsOptional()
  registrationDate?: Date

  @ApiPropertyOptional({
    description: 'Last update date of the certificate',
    example: '2023-01-02T00:00:00Z',
  })
  @IsDate({ message: 'updateDate must be a valid date' })
  @IsOptional()
  updateDate?: Date
}
