import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { LoansService } from './loans.service'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { LoanResDto } from './dto/res/loan-res.dto'
import { CreateLoanDto } from './dto/req/create-loan.dto'
import { FilterLoansDto } from './dto/req/filter-loans.dto'

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los préstamos con filtros',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  findAll(@Query() filterDto: FilterLoansDto) {
    return this.service.findAll(filterDto)
  }

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

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un préstamo por su ID',
  })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo préstamo con sus detalles',
  })
  @ApiBody({ type: CreateLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.CREATED)
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.service.create(createLoanDto)
  }
}
