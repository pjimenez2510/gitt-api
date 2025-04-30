import { IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class CustomersFiltersDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  search?: string
}
