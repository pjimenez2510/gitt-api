import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { CronService } from './cron.service'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationsModule,
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule { } 