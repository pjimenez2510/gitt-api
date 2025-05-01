import { Module } from '@nestjs/common'
import { ConditionsService } from './conditions.service'
import { ConditionsController } from './conditions.controller'

@Module({
  controllers: [ConditionsController],
  providers: [ConditionsService],
})
export class ConditionsModule {}
