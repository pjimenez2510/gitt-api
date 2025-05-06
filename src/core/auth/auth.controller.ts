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
import { UserRole } from './types/user-role'

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiStandardResponse(SignInResDto, HttpStatus.OK)
  async login(@Body() dto: SignInDto) {
    return this.service.login(dto)
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get Me',
  })
  @Auth(UserRole.ADMINISTRATOR)
  getMe(@Req() req: Request) {
    return req.user
  }
}
