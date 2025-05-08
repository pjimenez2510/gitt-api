import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { NormativeType } from '../../enums/normative-type.enum'
import { Origin } from '../../enums/origin.enum'

export class ItemResDto {
  @ApiProperty({
    description: 'id del item',
    example: 1,
  })
  @Expose()
  id: number

  @ApiProperty({
    description: 'código del item',
    example: 10001,
  })
  @Expose()
  code: number

  @ApiProperty({
    description: 'nombre del item',
    example: 'Laptop Dell XPS 13',
  })
  @Expose()
  name: string

  @ApiProperty({
    description: 'descripción del item',
    example: 'Laptop para uso administrativo',
  })
  @Expose()
  description: string

  @ApiProperty({
    description: 'ID del tipo de item',
    example: 1,
  })
  @Expose()
  itemTypeId: number

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @Expose()
  categoryId: number

  @ApiProperty({
    description: 'ID del estado',
    example: 1,
  })
  @Expose()
  statusId: number

  @ApiProperty({
    description: 'tipo normativo',
    example: NormativeType.PROPERTY,
    enum: NormativeType,
  })
  @Expose()
  normativeType: string

  @ApiProperty({
    description: 'origen del item',
    example: Origin.PURCHASE,
    enum: Origin,
  })
  @Expose()
  origin: string

  @ApiProperty({
    description: 'ID de la ubicación',
    example: 1,
  })
  @Expose()
  locationId: number

  @ApiProperty({
    description: 'ID del custodio',
    example: 1,
  })
  @Expose()
  custodianId: number

  @ApiProperty({
    description: 'disponible para préstamo',
    example: true,
  })
  @Expose()
  availableForLoan: boolean

  @ApiProperty({
    description: 'identificador único',
    example: 'LAP-001',
  })
  @Expose()
  identifier: string

  @ApiProperty({
    description: 'código anterior',
    example: 'LAP-001',
  })
  @Expose()
  previousCode: string

  @ApiProperty({
    description: 'ID de la certificación',
    example: 1,
  })
  @Expose()
  certificateId: number

  @ApiProperty({
    description: 'ID de la condición',
    example: 1,
  })
  @Expose()
  conditionId: number

  @ApiProperty({
    description: 'origen de entrada',
    example: 'Compra',
  })
  @Expose()
  entryOrigin: string

  @ApiProperty({
    description: 'tipo de entrada',
    example: 'Compra',
  })
  @Expose()
  entryType: string

  @ApiProperty({
    description: 'fecha de adquisición',
    example: '2021-01-01',
  })
  @Expose()
  acquisitionDate: string

  @ApiProperty({
    description: 'número de compromiso',
    example: '1234567890',
  })
  @Expose()
  commitmentNumber: string

  @ApiProperty({
    description: 'características del modelo',
    example: '1234567890',
  })
  @Expose()
  modelCharacteristics: string

  @ApiProperty({
    description: 'marca, raza o otro',
    example: 'Dell',
  })
  @Expose()
  brandBreedOther: string

  @ApiProperty({
    description: 'serie de identificación',
    example: '1234567890',
  })
  @Expose()
  identificationSeries: string

  @ApiProperty({
    description: 'fecha de garantía',
    example: '2021-01-01',
  })
  @Expose()
  warrantyDate: string

  @ApiProperty({
    description: 'dimensiones',
    example: '1234567890',
  })
  @Expose()
  dimensions: string

  @ApiProperty({
    description: 'crítico',
    example: true,
  })
  @Expose()
  critical: boolean

  @ApiProperty({
    description: 'peligroso',
    example: true,
  })
  @Expose()
  dangerous: boolean

  @ApiProperty({
    description: 'requiere tratamiento especial',
    example: true,
  })
  @Expose()
  requiresSpecialHandling: boolean

  @ApiProperty({
    description: 'perishable',
    example: true,
  })
  @Expose()
  perishable: boolean

  @ApiProperty({
    description: 'fecha de expiración',
    example: '2021-01-01',
  })
  @Expose()
  expirationDate: string

  @ApiProperty({
    description: 'línea de item',
    example: 'LAP-001',
  })
  @Expose()
  itemLine: number

  @ApiProperty({
    description: 'cuenta contable',
    example: '1234567890',
  })
  @Expose()
  accountingAccount: string

  @ApiProperty({
    description: 'observaciones',
    example: 'Observaciones del item',
  })
  @Expose()
  observations: string

  @ApiProperty({
    description: 'activo del custodio',
    example: true,
  })
  @Expose()
  activeCustodian: boolean

  @ApiProperty({
    description: 'ID del usuario de registro',
    example: 1,
  })
  @Expose()
  registrationUserId: number

  @Exclude()
  registrationDate: Date

  @Exclude()
  updateDate: Date

  @Exclude()
  active: boolean
}
