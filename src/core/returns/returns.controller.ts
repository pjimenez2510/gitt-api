import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
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
    @Body() createReturnLoanDto: CreateReturnLoanDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    if (!user) {
      throw new Error('User information is missing from request')
    }
    return await this.returnService.processReturn(createReturnLoanDto, user)
  }

  @Get('loan/:id')
  @ApiOperation({
    summary: 'Obtener información de un préstamo para su devolución',
  })
  @ApiOkResponse({
    description: 'Información del préstamo obtenida exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado' })
  async getLoanForReturn(@Param('id', ParseIntPipe) id: number) {
    return await this.returnService.getLoanForReturn(id)
  }

  @Get('active')
  @ApiOperation({
    summary: 'Obtener todos los préstamos activos (entregados)',
  })
  @ApiOkResponse({
    description: 'Lista de préstamos entregados recuperada exitosamente',
  })
  async getActiveLoans() {
    return await this.returnService.getActiveLoans()
  }

  @Get('active/user/:userId')
  @ApiOperation({
    summary: 'Obtener préstamos activos (entregados) de un usuario específico',
  })
  @ApiOkResponse({
    description: 'Lista de préstamos del usuario recuperada exitosamente',
  })
  async getActiveUserLoans(@Param('userId', ParseIntPipe) userId: number) {
    return await this.returnService.getActiveLoans(userId)
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Obtener préstamos vencidos pendientes de devolución',
  })
  @ApiOkResponse({
    description: 'Lista de préstamos vencidos obtenida exitosamente',
  })
  async getOverdueLoans() {
    return await this.returnService.getOverdueLoans()
  }
}
