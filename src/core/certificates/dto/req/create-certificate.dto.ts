import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { CertificateType } from '../../enums/certificate-type.enum'
import { CertificateStatus } from '../../enums/certificate-status.enum'

export class CreateCertificateDto {
  @ApiProperty({
    description: 'Certificate number (must be unique)',
    example: 12345,
  })
  @IsInt({ message: 'number must be an integer' })
  @IsNotEmpty({ message: 'number is required' })
  number: number

  @ApiProperty({
    description: 'Date of the certificate',
    example: '2023-10-01',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'date is required' })
  date: string

  @ApiProperty({
    description: 'Type of the certificate',
    example: CertificateType.TRANSFER,
  })
  @IsEnum(CertificateType)
  @IsNotEmpty({ message: 'type is required' })
  type: CertificateType

  @ApiProperty({
    description: 'Status of the certificate',
    example: CertificateStatus.DRAFT,
  })
  @IsEnum(CertificateStatus)
  @IsNotEmpty({ message: 'status is required' })
  status: CertificateStatus

  @ApiProperty({
    description: 'ID of the delivery responsible user',
    example: 1,
  })
  @IsInt({ message: 'deliveryResponsibleId must be an integer' })
  @IsOptional()
  deliveryResponsibleId?: number

  @ApiProperty({
    description: 'ID of the reception responsible user',
    example: 2,
  })
  @IsInt({ message: 'receptionResponsibleId must be an integer' })
  @IsOptional()
  receptionResponsibleId?: number

  @ApiProperty({
    description: 'Observations about the certificate',
    example: 'This is a sample observation.',
  })
  @IsString({ message: 'observations must be a string' })
  @IsOptional()
  observations?: string

  @ApiProperty({
    description: 'Whether the certificate is accounted',
    example: false,
  })
  @IsBoolean({ message: 'accounted must be a boolean' })
  @IsOptional()
  accounted?: boolean
}
