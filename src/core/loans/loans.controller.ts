import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { CreateReturnLoanDto } from './dto/req/create-return.dto'

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
      const result = await this.service.create(createLoanDto, user.id)
      req.action = 'loans:create:success'
      req.logMessage = `Préstamo creado con ID: ${result.id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'loans:create:failed'
      req.logMessage = `Error al crear préstamo: ${error.message}`
      throw error
    }
  }

  @Post('return')
  @ApiOperation({ summary: 'Registrar la devolución de un préstamo' })
  @ApiBearerAuth()
  @Auth(USER_TYPE.ADMINISTRATOR)
  async processReturn(
    @Req() req: Request,
    @Body() createReturnLoanDto: CreateReturnLoanDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'returns:process:attempt'
    req.logMessage = `Procesando devolución para el préstamo: ${createReturnLoanDto.loanId}`

    try {
      if (!user) {
        throw new Error(
          'No se encontró información del usuario en la solicitud',
        )
      }
      const result = await this.service.processReturn(createReturnLoanDto)
      req.action = 'returns:process:success'
      req.logMessage = `Devolución registrada exitosamente para el préstamo: ${createReturnLoanDto.loanId} por el usuario: ${user.id}`
      return result
    } catch (error) {
      req.action = 'returns:process:failed'
      req.logMessage = `Error al procesar la devolución para el préstamo ${createReturnLoanDto.loanId}: ${error.message}`
      throw error
    }
  }
}
