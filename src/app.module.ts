import { Module } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { CustomConfigModule } from './global/config/config.module'
import { UsersModule } from './core/users/users.module'
import { DatabaseModule } from './global/database/database.module'
import { StatesModule } from './core/states/states.module'
import { CategoriesModule } from './core/categories/categories.module'
import { AuthModule } from './core/auth/auth.module'
import { ItemTypesModule } from './core/item-types/item-types.module'
import { ConditionsModule } from './core/conditions/conditions.module'
import { MaterialsModule } from './core/materials/materials.module'
import { ColorsModule } from './core/colors/colors.module'
import { WarehousesModule } from './core/warehouses/warehouses.module'

@Module({
  imports: [
    UsersModule,
    CustomConfigModule,
    DatabaseModule,
    CategoriesModule,
    StatesModule,
    AuthModule,
    ItemTypesModule,
    ConditionsModule,
    MaterialsModule,
    ColorsModule,
    WarehousesModule,
  ],
  providers: [ResponseInterceptor],
})
export class AppModule {}
