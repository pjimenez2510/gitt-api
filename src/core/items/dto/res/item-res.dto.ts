import { ApiProperty } from '@nestjs/swagger'
import { NormativeType } from '../../enums/normative-type.enum'
import { Origin } from '../../enums/origin.enum'
import { ItemTypeResDto } from 'src/core/item-types/dto/res/item-type-res.dto'
import { CertificateResDto } from 'src/core/certificates/dto/res/certificate-res.dto'
import { ItemColorResDto } from 'src/core/item-colors/dto/res/item-color-res.dto'
import { ItemMaterialResDto } from 'src/core/item-materials/dto/res/item-material-res.dto'
import { StateResDto } from 'src/core/states/dto/res/state-res.dto'
import { ConditionResDto } from 'src/core/conditions/dto/res/condition-res.dto'
import { LocationResDto } from 'src/core/locations/dto/res/location-res.dto'
import { CategoryResDto } from 'src/core/categories/dto/res/category-res.dto'

export class ItemResDto {
  @ApiProperty({
    description: 'id del item',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'código del item',
    example: '10001',
  })
  code: string

  @ApiProperty({
    description: 'cantidad en stock',
    example: 10,
  })
  stock: number

  @ApiProperty({
    description: 'nombre del item',
    example: 'Laptop Dell XPS 13',
  })
  name: string

  @ApiProperty({
    description: 'descripción del item',
    example: 'Laptop para uso administrativo',
  })
  description: string

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  categoryId: number

  @ApiProperty({
    description: 'tipo normativo',
    example: NormativeType.PROPERTY,
    enum: NormativeType,
  })
  normativeType: string

  @ApiProperty({
    description: 'origen del item',
    example: Origin.PURCHASE,
    enum: Origin,
  })
  origin: string

  @ApiProperty({
    description: 'ID de la ubicación',
    example: 1,
  })
  locationId: number

  @ApiProperty({
    description: 'ID del custodio',
    example: 1,
  })
  custodianId: number

  @ApiProperty({
    description: 'disponible para préstamo',
    example: true,
  })
  availableForLoan: boolean

  @ApiProperty({
    description: 'identificador único',
    example: 'LAP-001',
  })
  identifier: string

  @ApiProperty({
    description: 'código anterior',
    example: 'LAP-001',
  })
  previousCode: string

  @ApiProperty({
    description: 'ID de la certificación',
    example: 1,
  })
  certificateId: number

  @ApiProperty({
    description: 'origen de entrada',
    example: 'Compra',
  })
  entryOrigin: string

  @ApiProperty({
    description: 'tipo de entrada',
    example: 'Compra',
  })
  entryType: string

  @ApiProperty({
    description: 'fecha de adquisición',
    example: '2021-01-01',
  })
  acquisitionDate: string

  @ApiProperty({
    description: 'número de compromiso',
    example: '1234567890',
  })
  commitmentNumber: string

  @ApiProperty({
    description: 'características del modelo',
    example: '1234567890',
  })
  modelCharacteristics: string

  @ApiProperty({
    description: 'marca, raza o otro',
    example: 'Dell',
  })
  brandBreedOther: string

  @ApiProperty({
    description: 'serie de identificación',
    example: '1234567890',
  })
  identificationSeries: string

  @ApiProperty({
    description: 'fecha de garantía',
    example: '2021-01-01',
  })
  warrantyDate: string

  @ApiProperty({
    description: 'dimensiones',
    example: '1234567890',
  })
  dimensions: string

  @ApiProperty({
    description: 'crítico',
    example: true,
  })
  critical: boolean

  @ApiProperty({
    description: 'peligroso',
    example: true,
  })
  dangerous: boolean

  @ApiProperty({
    description: 'requiere tratamiento especial',
    example: true,
  })
  requiresSpecialHandling: boolean

  @ApiProperty({
    description: 'perishable',
    example: true,
  })
  perishable: boolean

  @ApiProperty({
    description: 'fecha de expiración',
    example: '2021-01-01',
  })
  expirationDate: string

  @ApiProperty({
    description: 'línea de item',
    example: 'LAP-001',
  })
  itemLine: number

  @ApiProperty({
    description: 'cuenta contable',
    example: '1234567890',
  })
  accountingAccount: string

  @ApiProperty({
    description: 'observaciones',
    example: 'Observaciones del item',
  })
  observations: string

  @ApiProperty({
    description: 'activo del custodio',
    example: true,
  })
  activeCustodian: boolean

  @ApiProperty({
    description: 'itemType',
    example: 1,
  })
  itemType: ItemTypeResDto

  @ApiProperty({
    description: 'ID del usuario de registro',
    example: 1,
  })
  registrationUserId: number

  @ApiProperty({
    description: 'certificación',
  })
  certificate: CertificateResDto

  @ApiProperty({
    description: 'colores',
  })
  colors: ItemColorResDto[]

  @ApiProperty({
    description: 'materiales',
  })
  materials: ItemMaterialResDto[]

  @ApiProperty({
    description: 'estado',
  })
  status: StateResDto

  @ApiProperty({
    description: 'condición',
    example: 1,
  })
  condition: ConditionResDto

  @ApiProperty({
    description: 'ubicación',
  })
  location: LocationResDto

  @ApiProperty({
    description: 'categoría',
  })
  category: CategoryResDto
}
