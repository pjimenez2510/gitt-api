import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger'
import { CreateReturnLoanDto } from './dto/req/create-return.dto'
import { ReturnService } from './returns.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'

@ApiTags('returns')
@ApiBearerAuth()
@Controller('returns')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar la devolución de un préstamo' })
  @ApiResponse({
    status: 201,
    description: 'La devolución ha sido registrada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado' })
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

      const result = await this.returnService.processReturn(
        createReturnLoanDto,
        user,
      )
      req.action = 'returns:process:success'
      req.logMessage = `Devolución registrada exitosamente para el préstamo: ${createReturnLoanDto.loanId} por el usuario: ${user.id}`
      return result
    } catch (error) {
      req.action = 'returns:process:failed'
      req.logMessage = `Error al procesar la devolución para el préstamo ${createReturnLoanDto.loanId}: ${error.message}`
      throw error
    }
  }

  @Get('loan/:id')
  @ApiOperation({
    summary: 'Obtener información de un préstamo para su devolución',
  })
  @ApiOkResponse({
    description: 'Información del préstamo obtenida exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado' })
  async getLoanForReturn(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    req.action = 'returns:get-loan:attempt'
    req.logMessage = `Obteniendo información para devolución del préstamo: ${id}`

    try {
      const result = await this.returnService.getLoanForReturn(id)
      req.action = 'returns:get-loan:success'
      req.logMessage = `Información del préstamo ${id} obtenida correctamente`
      return result
    } catch (error) {
      req.action = 'returns:get-loan:failed'
      req.logMessage = `Error al obtener información del préstamo ${id}: ${error.message}`
      throw error
    }
  }

  @Get('active')
  @ApiOperation({
    summary: 'Obtener todos los préstamos activos (entregados)',
  })
  @ApiOkResponse({
    description: 'Lista de préstamos entregados recuperada exitosamente',
  })
  async getActiveLoans(@Req() req: Request) {
    req.action = 'returns:active-loans:attempt'
    req.logMessage = 'Obteniendo lista de préstamos activos'

    try {
      const result = await this.returnService.getActiveLoans()
      req.action = 'returns:active-loans:success'
      req.logMessage = `Se obtuvieron ${result.length} préstamos activos`
      return result
    } catch (error) {
      req.action = 'returns:active-loans:failed'
      req.logMessage = `Error al obtener préstamos activos: ${error.message}`
      throw error
    }
  }

  @Get('active/user/:userId')
  @ApiOperation({
    summary: 'Obtener préstamos activos (entregados) de un usuario específico',
  })
  @ApiOkResponse({
    description: 'Lista de préstamos del usuario recuperada exitosamente',
  })
  async getActiveUserLoans(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    req.action = 'returns:user-active-loans:attempt'
    req.logMessage = `Obteniendo préstamos activos para el usuario: ${userId}`

    try {
      const result = await this.returnService.getActiveLoans(userId)
      req.action = 'returns:user-active-loans:success'
      req.logMessage = `Se obtuvieron ${result.length} préstamos activos para el usuario: ${userId}`
      return result
    } catch (error) {
      req.action = 'returns:user-active-loans:failed'
      req.logMessage = `Error al obtener préstamos activos del usuario ${userId}: ${error.message}`
      throw error
    }
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Obtener préstamos vencidos pendientes de devolución',
  })
  @ApiOkResponse({
    description: 'Lista de préstamos vencidos obtenida exitosamente',
  })
  async getOverdueLoans(@Req() req: Request) {
    req.action = 'returns:overdue-loans:attempt'
    req.logMessage = 'Obteniendo lista de préstamos vencidos'

    try {
      const result = await this.returnService.getOverdueLoans()
      req.action = 'returns:overdue-loans:success'
      req.logMessage = `Se obtuvieron ${result.length} préstamos vencidos`
      return result
    } catch (error) {
      req.action = 'returns:overdue-loans:failed'
      req.logMessage = `Error al obtener préstamos vencidos: ${error.message}`
      throw error
    }
  }
}
