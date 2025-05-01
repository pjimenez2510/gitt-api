import { Module } from '@nestjs/common'
import { ItemTypesService } from './item-types.service'
import { ItemTypesController } from './item-types.controller'

@Module({
  controllers: [ItemTypesController],
  providers: [ItemTypesService],
})
export class ItemTypesModule {}
