import { Module } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { CustomConfigModule } from './global/config/config.module'
import { UsersModule } from './core/users/users.module'
import { DatabaseModule } from './global/database/database.module'

@Module({
  imports: [UsersModule, CustomConfigModule, DatabaseModule],
  providers: [ResponseInterceptor],
})
export class AppModule {}
