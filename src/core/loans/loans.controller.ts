import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Patch,
} from '@nestjs/common'
import { LoansService } from './loans.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { LoanResDto } from './dto/res/loan-res.dto'
import { CreateLoanDto } from './dto/req/create-loan.dto'
import { FilterLoansDto } from './dto/req/filter-loans.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { ApproveLoanDto } from './dto/req/approve-loan.dto'
import { DeliverLoanDto } from './dto/req/deliver-loan.dto'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'
import { GetUser } from '../auth/decorators/get-user.decorator'
@ApiTags('Loans')
@Controller('loans')
@ApiBearerAuth()
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Get()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener todos los préstamos con filtros',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  findAll(@Query() filterDto: FilterLoansDto) {
    return this.service.findAll(filterDto)
  }

  @Get('active')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener todos los préstamos activos',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  findActive(@Query() paginationDto: BaseParamsDto) {
    return this.service.findActive(paginationDto)
  }

  @Get('historial/:dni')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
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
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener un préstamo por su ID',
  })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Post()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Crear un nuevo préstamo con sus detalles',
  })
  @ApiBody({ type: CreateLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.CREATED)
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.service.create(createLoanDto)
  }

  @Patch(':id/approve')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Aprobar un préstamo solicitado',
  })
  @ApiBody({ type: ApproveLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  approveLoan(
    @Param('id') id: string,
    @Body() approveLoanDto: ApproveLoanDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    return this.service.approveLoan(+id, approveLoanDto, user.id)
  }

  @Patch(':id/deliver')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Registrar la entrega de un préstamo aprobado',
  })
  @ApiBody({ type: DeliverLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  deliverLoan(@Param('id') id: string, @Body() deliverLoanDto: DeliverLoanDto) {
    return this.service.deliverLoan(+id, deliverLoanDto)
  }
}
