import { Module } from '@nestjs/common'
import { ItemColorsService } from './item-colors.service'
import { ItemColorsController } from './item-colors.controller'

@Module({
  providers: [ItemColorsService],
  controllers: [ItemColorsController],
})
export class ItemColorsModule {}
