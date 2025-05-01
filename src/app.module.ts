import { Module } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { CustomConfigModule } from './global/config/config.module'
import { UsersModule } from './core/users/users.module'
import { DatabaseModule } from './global/database/database.module'
import { CategoriesModule } from './core/categories/users.module'
import { ItemTypesModule } from './core/item-types/item-types.module'
import { ConditionsModule } from './core/conditions/conditions.module'
import { MaterialsModule } from './core/materials/materials.module'

@Module({
  imports: [
    UsersModule,
    CustomConfigModule,
    DatabaseModule,
    CategoriesModule,
    ItemTypesModule,
    ConditionsModule,
    MaterialsModule,
  ],
  providers: [ResponseInterceptor],
})
export class AppModule {}
