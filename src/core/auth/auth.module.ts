import { Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'
import { CustomConfigService } from 'src/global/config/config.service'
import { CustomConfigModule } from 'src/global/config/config.module'

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (configService: CustomConfigService) => ({
        secret: configService.env.JWT_SECRET,
        signOptions: { expiresIn: '2h' },
      }),
      global: true,
    }),
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
