import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { EmailService } from '../email/email.service'
import { eq, and, lt, gte, lte, sql } from 'drizzle-orm'
import { loan } from 'drizzle/schema/tables/loans'
import { loanDetail } from 'drizzle/schema/tables/loans/loanDetail'
import { person } from 'drizzle/schema/tables/users/person'
import { item } from 'drizzle/schema/tables/inventory/item/item'
import { notificationTemplate } from 'drizzle/schema/tables/notifications/notificationTemplate'
import { notification } from 'drizzle/schema/tables/notifications/notification'
import { deliveryRecord } from 'drizzle/schema/tables/notifications/deliveryRecord'
import { user } from 'drizzle/schema/tables/users/user'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  constructor(
    private readonly dbService: DatabaseService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Envía notificación de préstamo creado
   */
  async sendLoanCreatedNotification(loanId: number): Promise<void> {
    try {
      // Obtener información del préstamo con detalles
      //hold 3 secs
      await new Promise(resolve => setTimeout(resolve, 3000))
      this.logger.log('Obteniendo información del préstamo')

      const loanWithDetails = await this.dbService.db
        .select({
          id: loan.id,
          scheduledReturnDate: loan.scheduledReturnDate,
          requestorId: loan.requestorId,
          personEmail: person.email,
          personFirstName: person.firstName,
          personLastName: person.lastName,
        })
        .from(loan)
        .innerJoin(person, eq(loan.requestorId, person.id))
        .where(eq(loan.id, loanId))
        .limit(1)

      if (loanWithDetails.length === 0) {
        this.logger.warn(`No se encontró el préstamo ${loanId} para enviar notificación`)
        return
      }

      const loanData = loanWithDetails[0]

      // Obtener detalles del préstamo con nombres de items
      const loanDetails = await this.dbService.db
        .select({
          itemId: loanDetail.itemId,
          itemName: item.name,
          quantity: loanDetail.quantity,
        })
        .from(loanDetail)
        .innerJoin(item, eq(loanDetail.itemId, item.id))
        .where(eq(loanDetail.loanId, loanId))

      if (loanDetails.length === 0) {
        this.logger.warn(`No se encontraron detalles para el préstamo ${loanId}`)
        return
      }

      // Obtener template
      const [template] = await this.dbService.db
        .select()
        .from(notificationTemplate)
        .where(eq(notificationTemplate.type, 'LOAN'))
        .limit(1)

      if (!template) {
        this.logger.warn('No se encontró template para notificación de préstamo')
        return
      }

      // Preparar datos para el template
      const equipmentNames = loanDetails.map(detail => detail.itemName).join(', ')
      const dueDate = loanData.scheduledReturnDate.toISOString().split('T')[0]
      const userName = `${loanData.personFirstName} ${loanData.personLastName}`

      // Procesar template
      const title = this.processTemplate(template.templateTitle, {
        equipment: equipmentNames,
        userName,
        dueDate,
      })

      const content = this.processTemplate(template.templateContent, {
        equipment: equipmentNames,
        userName,
        dueDate,
      })

      // Enviar email
      await this.emailService.sendEmailWithTemplate(
        loanData.personEmail,
        title,
        content,
      )

      // Registrar notificación en la base de datos
      await this.recordNotification(
        loanData.requestorId,
        'LOAN',
        title,
        content,
        loanId,
        'LOAN',
      )

      this.logger.log(`Notificación de préstamo enviada para loan ${loanId}`)
    } catch (error) {
      this.logger.error(`Error enviando notificación de préstamo ${loanId}:`, error)
    }
  }

  /**
   * Envía notificaciones de recordatorio (5 días antes del vencimiento)
   */
  async sendReturnReminderNotifications(): Promise<void> {
    try {
      const fiveDaysFromNow = new Date()
      fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)

      // Obtener préstamos que vencen en 5 días y no han recibido recordatorio
      const loansToRemind = await this.dbService.db
        .select({
          id: loan.id,
          scheduledReturnDate: loan.scheduledReturnDate,
          requestorId: loan.requestorId,
          personEmail: person.email,
          personFirstName: person.firstName,
          personLastName: person.lastName,
        })
        .from(loan)
        .innerJoin(person, eq(loan.requestorId, person.id))
        .where(
          and(
            eq(loan.status, 'DELIVERED'),
            eq(loan.reminderSent, false),
            gte(loan.scheduledReturnDate, new Date()),
            lte(loan.scheduledReturnDate, fiveDaysFromNow),
          ),
        )

      if (loansToRemind.length === 0) {
        this.logger.log('No hay préstamos que requieran recordatorio')
        return
      }

      // Obtener template de recordatorio
      const [template] = await this.dbService.db
        .select()
        .from(notificationTemplate)
        .where(eq(notificationTemplate.type, 'RETURN'))
        .limit(1)

      if (!template) {
        this.logger.warn('No se encontró template para notificación de recordatorio')
        return
      }

      for (const loanData of loansToRemind) {
        try {
          // Obtener detalles del préstamo
          const loanDetails = await this.dbService.db
            .select({
              itemId: loanDetail.itemId,
              itemName: item.name,
              quantity: loanDetail.quantity,
            })
            .from(loanDetail)
            .innerJoin(item, eq(loanDetail.itemId, item.id))
            .where(eq(loanDetail.loanId, loanData.id))

          if (loanDetails.length === 0) continue

          // Calcular días restantes
          const daysRemaining = Math.ceil(
            (loanData.scheduledReturnDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )

          // Preparar datos para el template
          const equipmentNames = loanDetails.map(detail => detail.itemName).join(', ')
          const dueDate = loanData.scheduledReturnDate.toISOString().split('T')[0]
          const userName = `${loanData.personFirstName} ${loanData.personLastName}`

          // Procesar template
          const title = this.processTemplate(template.templateTitle, {
            equipment: equipmentNames,
            userName,
            dueDate,
            daysRemaining: daysRemaining.toString(),
          })

          const content = this.processTemplate(template.templateContent, {
            equipment: equipmentNames,
            userName,
            dueDate,
            daysRemaining: daysRemaining.toString(),
          })

          // Enviar email
          await this.emailService.sendEmailWithTemplate(
            loanData.personEmail,
            title,
            content,
          )

          // Marcar como recordatorio enviado
          await this.dbService.db
            .update(loan)
            .set({ reminderSent: true, updateDate: new Date() })
            .where(eq(loan.id, loanData.id))

          // Registrar notificación
          await this.recordNotification(
            loanData.requestorId,
            'RETURN',
            title,
            content,
            loanData.id,
            'LOAN',
          )

          this.logger.log(`Recordatorio enviado para préstamo ${loanData.id}`)
        } catch (error) {
          this.logger.error(`Error enviando recordatorio para préstamo ${loanData.id}:`, error)
        }
      }
    } catch (error) {
      this.logger.error('Error en proceso de recordatorios:', error)
    }
  }

  /**
   * Envía notificaciones de préstamos vencidos
   */
  async sendExpiredLoanNotifications(): Promise<void> {
    try {
      // Obtener préstamos vencidos
      const expiredLoans = await this.dbService.db
        .select({
          id: loan.id,
          scheduledReturnDate: loan.scheduledReturnDate,
          requestorId: loan.requestorId,
          personEmail: person.email,
          personFirstName: person.firstName,
          personLastName: person.lastName,
        })
        .from(loan)
        .innerJoin(person, eq(loan.requestorId, person.id))
        .where(
          and(
            eq(loan.status, 'DELIVERED'),
            lt(loan.scheduledReturnDate, new Date()),
          ),
        )

      if (expiredLoans.length === 0) {
        this.logger.log('No hay préstamos vencidos')
        return
      }

      // Obtener template de vencimiento
      const [template] = await this.dbService.db
        .select()
        .from(notificationTemplate)
        .where(eq(notificationTemplate.type, 'EXPIRATION'))
        .limit(1)

      if (!template) {
        this.logger.warn('No se encontró template para notificación de vencimiento')
        return
      }

      for (const loanData of expiredLoans) {
        try {
          // Obtener detalles del préstamo
          const loanDetails = await this.dbService.db
            .select({
              itemId: loanDetail.itemId,
              itemName: item.name,
              quantity: loanDetail.quantity,
            })
            .from(loanDetail)
            .innerJoin(item, eq(loanDetail.itemId, item.id))
            .where(eq(loanDetail.loanId, loanData.id))

          if (loanDetails.length === 0) continue

          // Calcular días de retraso
          const overdueDays = Math.ceil(
            (new Date().getTime() - loanData.scheduledReturnDate.getTime()) / (1000 * 60 * 60 * 24)
          )

          // Preparar datos para el template
          const equipmentNames = loanDetails.map(detail => detail.itemName).join(', ')
          const dueDate = loanData.scheduledReturnDate.toISOString().split('T')[0]
          const userName = `${loanData.personFirstName} ${loanData.personLastName}`

          // Procesar template
          const title = this.processTemplate(template.templateTitle, {
            equipment: equipmentNames,
            userName,
            dueDate,
            overdueDays: overdueDays.toString(),
          })

          const content = this.processTemplate(template.templateContent, {
            equipment: equipmentNames,
            userName,
            dueDate,
            overdueDays: overdueDays.toString(),
          })

          // Enviar email
          await this.emailService.sendEmailWithTemplate(
            loanData.personEmail,
            title,
            content,
          )

          // Registrar notificación
          await this.recordNotification(
            loanData.requestorId,
            'EXPIRATION',
            title,
            content,
            loanData.id,
            'LOAN',
          )

          this.logger.log(`Notificación de vencimiento enviada para préstamo ${loanData.id}`)
        } catch (error) {
          this.logger.error(`Error enviando notificación de vencimiento para préstamo ${loanData.id}:`, error)
        }
      }
    } catch (error) {
      this.logger.error('Error en proceso de notificaciones de vencimiento:', error)
    }
  }

  /**
   * Procesa un template reemplazando las variables
   */
  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template;
    for (const [key, value] of Object.entries(variables)) {
      // Permite espacios dentro de las llaves
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      processed = processed.replace(regex, value);
    }
    return processed;
  }

  /**
   * Método de prueba para verificar el procesamiento de templates
   */
  async testTemplateProcessing(loanId: number) {
    try {
      // Obtener información del préstamo
      const loanWithDetails = await this.dbService.db
        .select({
          id: loan.id,
          scheduledReturnDate: loan.scheduledReturnDate,
          requestorId: loan.requestorId,
          personEmail: person.email,
          personFirstName: person.firstName,
          personLastName: person.lastName,
        })
        .from(loan)
        .innerJoin(person, eq(loan.requestorId, person.id))
        .where(eq(loan.id, loanId))
        .limit(1)

      if (loanWithDetails.length === 0) {
        return { error: `No se encontró el préstamo ${loanId}` }
      }

      const loanData = loanWithDetails[0]

      // Obtener detalles del préstamo
      const loanDetails = await this.dbService.db
        .select({
          itemId: loanDetail.itemId,
          itemName: item.name,
          quantity: loanDetail.quantity,
        })
        .from(loanDetail)
        .innerJoin(item, eq(loanDetail.itemId, item.id))
        .where(eq(loanDetail.loanId, loanId))

      if (loanDetails.length === 0) {
        return { error: `No se encontraron detalles para el préstamo ${loanId}` }
      }

      // Obtener todos los templates
      const templates = await this.dbService.db
        .select()
        .from(notificationTemplate)

      // Preparar datos para el template
      const equipmentNames = loanDetails.map(detail => detail.itemName).join(', ')
      const dueDate = loanData.scheduledReturnDate.toISOString().split('T')[0]
      const userName = `${loanData.personFirstName} ${loanData.personLastName}`

      // Calcular días de retraso
      const overdueDays = Math.ceil(
        (new Date().getTime() - loanData.scheduledReturnDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Calcular días restantes
      const daysRemaining = Math.ceil(
        (loanData.scheduledReturnDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )

      // Variables disponibles
      const variables = {
        equipment: equipmentNames,
        userName,
        dueDate,
        overdueDays: overdueDays.toString(),
        daysRemaining: daysRemaining.toString(),
      }

      // Procesar cada template
      const processedTemplates = templates.map(template => {
        const processedTitle = this.processTemplate(template.templateTitle, variables)
        const processedContent = this.processTemplate(template.templateContent, variables)

        return {
          type: template.type,
          originalTitle: template.templateTitle,
          processedTitle,
          originalContent: template.templateContent,
          processedContent,
          variables,
        }
      })

      return {
        loanInfo: {
          id: loanData.id,
          personName: userName,
          personEmail: loanData.personEmail,
          scheduledReturnDate: dueDate,
          overdueDays,
          daysRemaining,
          equipment: equipmentNames,
        },
        templates: processedTemplates,
      }
    } catch (error) {
      this.logger.error(`Error probando template para préstamo ${loanId}:`, error)
      return { error: error.message }
    }
  }

  /**
   * Registra una notificación en la base de datos
   */
  private async recordNotification(
    personId: number,
    type: string,
    title: string,
    content: string,
    entityId?: number,
    entityType?: string,
  ): Promise<void> {
    try {
      // Buscar el usuario asociado a la persona
      const [userRecord] = await this.dbService.db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.personId, personId))
        .limit(1)

      if (!userRecord) {
        this.logger.warn(`No se encontró usuario para persona ${personId}`)
        return
      }

      // Crear notificación
      const [notificationRecord] = await this.dbService.db
        .insert(notification)
        .values({
          userId: userRecord.id,
          type: type as any,
          title,
          content,
          entityId,
          entityType,
        })
        .returning()

      // Crear registro de entrega
      await this.dbService.db
        .insert(deliveryRecord)
        .values({
          notificationId: notificationRecord.id,
          channel: 'EMAIL',
          deliveryStatus: 'SENT',
        })

    } catch (error) {
      this.logger.error('Error registrando notificación:', error)
    }
  }
} 