import {
  Controller,
  Post,
  Logger,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { NotificationsService } from './notifications.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name)

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-reminders')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Enviar recordatorios de devolución manualmente',
    description: 'Envía recordatorios a préstamos que vencen en 5 días',
  })
  async sendReminders() {
    this.logger.log('Enviando recordatorios manualmente...')
    await this.notificationsService.sendReturnReminderNotifications()
    return { message: 'Recordatorios enviados exitosamente' }
  }

  @Post('send-expired-notifications')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Enviar notificaciones de préstamos vencidos manualmente',
    description: 'Envía notificaciones a préstamos que ya han vencido',
  })
  async sendExpiredNotifications() {
    this.logger.log('Enviando notificaciones de vencimiento manualmente...')
    await this.notificationsService.sendExpiredLoanNotifications()
    return { message: 'Notificaciones de vencimiento enviadas exitosamente' }
  }
}
