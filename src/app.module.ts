import { Module } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { CustomConfigModule } from './global/config/config.module'
import { UsersModule } from './core/users/users.module'
import { DatabaseModule } from './global/database/database.module'
import { CategoriesModule } from './core/categories/categories.module'
import { AuthModule } from './core/auth/auth.module'

@Module({
  imports: [
    UsersModule,
    CustomConfigModule,
    DatabaseModule,
    CategoriesModule,
    AuthModule,
  ],
  providers: [ResponseInterceptor],
})
export class AppModule {}
