import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Patch,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
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
@ApiBearerAuth()
@Controller('loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Get()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener todos los préstamos con filtros',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterLoansDto) {
    req.action = 'loans:find-all:attempt'
    req.logMessage = 'Obteniendo todos los préstamos con filtros'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'loans:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} préstamos`
      return result
    } catch (error) {
      req.action = 'loans:find-all:failed'
      req.logMessage = `Error al obtener préstamos: ${error.message}`
      throw error
    }
  }

  @Get('active')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener todos los préstamos activos',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  async findActive(@Req() req: Request, @Query() paginationDto: BaseParamsDto) {
    req.action = 'loans:find-active:attempt'
    req.logMessage = 'Obteniendo préstamos activos'

    try {
      const result = await this.service.findActive(paginationDto)
      req.action = 'loans:find-active:success'
      req.logMessage = `Se obtuvieron ${result.records.length} préstamos activos`
      return result
    } catch (error) {
      req.action = 'loans:find-active:failed'
      req.logMessage = `Error al obtener préstamos activos: ${error.message}`
      throw error
    }
  }

  @Get('historial/:dni')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener historial de préstamos por DNI',
  })
  @ApiPaginatedResponse(LoanResDto, HttpStatus.OK)
  async findByUserDni(
    @Req() req: Request,
    @Param('dni') dni: string,
    @Query() paginationDto: BaseParamsDto,
  ) {
    req.action = 'loans:find-by-user-dni:attempt'
    req.logMessage = `Buscando historial de préstamos para DNI: ${dni}`

    try {
      const result = await this.service.findByUserDni(paginationDto, dni)
      req.action = 'loans:find-by-user-dni:success'
      req.logMessage = `Se encontraron ${result.records.length} préstamos para el DNI: ${dni}`
      return result
    } catch (error) {
      req.action = 'loans:find-by-user-dni:failed'
      req.logMessage = `Error al buscar historial de préstamos para DNI ${dni}: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener un préstamo por su ID',
  })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    req.action = 'loans:find-one:attempt'
    req.logMessage = `Buscando préstamo con ID: ${id}`

    try {
      const result = await this.service.findOne(+id)
      req.action = 'loans:find-one:success'
      req.logMessage = `Préstamo encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'loans:find-one:failed'
      req.logMessage = `Error al buscar préstamo ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Crear un nuevo préstamo con sus detalles',
  })
  @ApiBody({ type: CreateLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() createLoanDto: CreateLoanDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'loans:create:attempt'
    req.logMessage = `Usuario ${user.id} está creando un nuevo préstamo`

    try {
      const result = await this.service.create(createLoanDto)
      req.action = 'loans:create:success'
      req.logMessage = `Préstamo creado con ID: ${result.id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'loans:create:failed'
      req.logMessage = `Error al crear préstamo: ${error.message}`
      throw error
    }
  }

  @Patch(':id/approve')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Aprobar un préstamo solicitado',
  })
  @ApiBody({ type: ApproveLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  async approveLoan(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() approveLoanDto: ApproveLoanDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'loans:approve:attempt'
    req.logMessage = `Usuario ${user.id} está aprobando el préstamo ID: ${id}`

    try {
      const result = await this.service.approveLoan(
        +id,
        approveLoanDto,
        user.id,
      )
      req.action = 'loans:approve:success'
      req.logMessage = `Préstamo aprobado ID: ${id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'loans:approve:failed'
      req.logMessage = `Error al aprobar préstamo ID ${id}: ${error.message}`
      throw error
    }
  }

  @Patch(':id/deliver')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Registrar la entrega de un préstamo aprobado',
  })
  @ApiBody({ type: DeliverLoanDto })
  @ApiStandardResponse(LoanResDto, HttpStatus.OK)
  async deliverLoan(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deliverLoanDto: DeliverLoanDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'loans:deliver:attempt'
    req.logMessage = `Usuario ${user.id} está registrando la entrega del préstamo ID: ${id}`

    try {
      const result = await this.service.deliverLoan(+id, deliverLoanDto)
      req.action = 'loans:deliver:success'
      req.logMessage = `Entrega de préstamo registrada ID: ${id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'loans:deliver:failed'
      req.logMessage = `Error al registrar entrega de préstamo ID ${id}: ${error.message}`
      throw error
    }
  }
}
