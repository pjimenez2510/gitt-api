import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(private readonly notificationsService: NotificationsService) { }

  /**
   * Ejecuta recordatorios de devolución todos los días a las 12:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleReturnReminders() {
    this.logger.log('Iniciando proceso de recordatorios de devolución...')

    try {
      await this.notificationsService.sendReturnReminderNotifications()
      this.logger.log('Proceso de recordatorios completado exitosamente')
    } catch (error) {
      this.logger.error('Error en proceso de recordatorios:', error)
    }
  }

  /**
   * Ejecuta notificaciones de préstamos vencidos todos los días a las 12:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredLoans() {
    this.logger.log('Iniciando proceso de notificaciones de préstamos vencidos...')

    try {
      await this.notificationsService.sendExpiredLoanNotifications()
      this.logger.log('Proceso de notificaciones de vencimiento completado exitosamente')
    } catch (error) {
      this.logger.error('Error en proceso de notificaciones de vencimiento:', error)
    }
  }
} 