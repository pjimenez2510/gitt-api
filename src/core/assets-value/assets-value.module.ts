import { Module } from '@nestjs/common'
import { AssetsValueController } from './assets-value.controller'
import { AssetsValueService } from './assets-value.service'

@Module({
  controllers: [AssetsValueController],
  providers: [AssetsValueService],
})
export class AssetsValueModule {}
