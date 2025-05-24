import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/req/sign-in.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { SignInResDto } from './dto/res/sign-in-res.dto'
import { Auth } from './decorators/auth.decorator'
import { Request } from 'express'
import { USER_TYPE } from '../users/types/user-type.enum'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiStandardResponse(SignInResDto, HttpStatus.OK)
  async login(@Req() req: Request, @Body() dto: SignInDto) {
    req.action = 'auth:login:attempt'
    req.logMessage = `Intento de inicio de sesión para el email: ${dto.email}`

    try {
      const result = await this.service.login(dto)
      req.action = 'auth:login:success'
      req.logMessage = `Inicio de sesión exitoso para el email: ${dto.email}`
      return result
    } catch (error) {
      req.action = 'auth:login:failed'
      req.logMessage = `Error en inicio de sesión para el email: ${dto.email} - ${error.message}`
      throw error
    }
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get Me',
  })
  @ApiBearerAuth()
  @Auth(USER_TYPE.ADMINISTRATOR)
  getMe(@Req() req: Request) {
    const user = req.user as { id?: number } | undefined
    const userId = user?.id ?? 'desconocido'
    req.action = 'auth:me:retrieved'
    req.logMessage = `Usuario consultó su información: ID ${userId}`
    return req.user
  }
}
