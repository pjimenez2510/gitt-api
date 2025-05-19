import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { LoansService } from './loans.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiPaginatedResponse } from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { LoanResDto } from './dto/res/loan-res.dto'
@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Get('active')
  @ApiOperation({
    summary: 'Obtener todos los préstamos activos',
    description:
      'Los préstamos activos son aquellos que no han sido cancelados, devueltos o han expirado.',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  findActive(@Query() paginationDto: BaseParamsDto) {
    return this.service.findActive(paginationDto)
  }

  // @Get('active')
  // @ApiOperation({
  //   summary: 'Obtener todos los préstamos activos',
  //   description:
  //     'Los préstamos activos son aquellos que no han sido cancelados, devueltos o han expirado.',
  // })
  // @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  // findByUserDni(@Query() paginationDto: BaseParamsDto) {
  //   return this.service.findByUserDni(paginationDto,)
  // }
}
