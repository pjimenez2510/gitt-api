import { Module } from '@nestjs/common'
import { LoanDetailsService } from './loan-details.service'
import { LoanDetailsController } from './loan-details.controller'

@Module({
  providers: [LoanDetailsService],
  controllers: [LoanDetailsController],
  exports: [LoanDetailsService],
})
export class LoanDetailsModule {}
