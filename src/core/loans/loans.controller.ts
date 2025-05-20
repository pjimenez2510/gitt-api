import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { LoansService } from './loans.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiPaginatedResponse } from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { LoanResDto } from './dto/res/loan-res.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
@ApiTags('Loans')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Get('active')
  @ApiOperation({
    summary: 'Obtener todos los préstamos activos',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  findActive(@Query() paginationDto: BaseParamsDto) {
    return this.service.findActive(paginationDto)
  }

  @Get('historial/:dni')
  @ApiOperation({
    summary: 'Obtener historial de préstamos por DNI',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  findByUserDni(
    @Param('dni') dni: string,
    @Query() paginationDto: BaseParamsDto,
  ) {
    return this.service.findByUserDni(paginationDto, dni)
  }
}
