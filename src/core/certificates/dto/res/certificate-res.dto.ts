import { ApiProperty } from '@nestjs/swagger'

export class CertificateResDto {
  @ApiProperty({
    description: 'ID of the certificate',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Number of the certificate',
    example: 12345,
  })
  number: number

  @ApiProperty({
    description: 'Date of the certificate',
    example: '2023-10-01',
  })
  date: string

  @ApiProperty({
    description: 'Type of the certificate',
    example: 'INVENTORY',
  })
  type: string

  @ApiProperty({
    description: 'Status of the certificate',
    example: 'ACTIVE',
  })
  status: string

  @ApiProperty({
    description: 'ID of the delivery responsible user',
    example: 2,
  })
  deliveryResponsibleId: number

  @ApiProperty({
    description: 'ID of the reception responsible user',
    example: 3,
  })
  receptionResponsibleId: number

  @ApiProperty({
    description: 'Observations related to the certificate',
    example: 'Certificate issued for inventory purposes',
  })
  observations: string

  @ApiProperty({
    description: 'Indicates if the certificate is accounted',
    example: false,
  })
  accounted: boolean

  @ApiProperty({
    description: 'Registration date of the certificate',
    example: '2023-10-01T12:00:00Z',
  })
  registrationDate: string

  @ApiProperty({
    description: 'Last update date of the certificate',
    example: '2023-10-02T12:00:00Z',
  })
  updateDate: string
}
