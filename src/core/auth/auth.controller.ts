import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/req/sign-in.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { SignInResDto } from './dto/res/sign-in-res.dto'

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
  async login(@Body() dto: SignInDto) {
    return this.service.login(dto)
  }

  // @AdminAuth()
  // @Get('me')
  // getProfile(@Request() req) {
  //   const user = req.user

  //   return user
  // }
}
