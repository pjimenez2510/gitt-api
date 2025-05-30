import { Module } from '@nestjs/common'
import { ItemImagesService } from './item-images.service'
import { ItemImagesController } from './item-images.controller'

@Module({
  providers: [ItemImagesService],
  controllers: [ItemImagesController],
})
export class ItemImagesModule {}
