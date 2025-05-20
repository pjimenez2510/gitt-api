import { Module } from '@nestjs/common'
import { ReturnService } from './returns.service'
import { ReturnController } from './returns.controller'

@Module({
  controllers: [ReturnController],
  providers: [ReturnService],
})
export class ReturnsModule {}
