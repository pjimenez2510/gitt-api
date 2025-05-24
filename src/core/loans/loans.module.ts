import { Module } from '@nestjs/common'
import { LoansService } from './loans.service'
import { LoansController } from './loans.controller'
import { LoanDetailsModule } from './loan-details/loan-details.module'
import { UsersModule } from '../users/users.module'
import { ItemsModule } from '../items/items.module'

@Module({
  providers: [LoansService],
  controllers: [LoansController],
  imports: [LoanDetailsModule, UsersModule, ItemsModule],
})
export class LoansModule {}
