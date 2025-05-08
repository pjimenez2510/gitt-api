import { Module } from '@nestjs/common'
import { ItemMaterialsService } from './item-materials.service'
import { ItemMaterialsController } from './item-materials.controller'

@Module({
  providers: [ItemMaterialsService],
  controllers: [ItemMaterialsController],
})
export class ItemMaterialsModule {}
