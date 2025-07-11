import { Injectable, Logger } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmail(email: string, equipment: string, dueDate: string) {
    try {
      Logger.log('tratando de hacer el email')
      Logger.log(
        'credenciales ' +
        process.env.MAIL_HOST! +
        process.env.MAIL_PORT! +
        process.env.MAIL_USER!,
      )
      await this.mailerService.sendMail({
        to: email,
        subject: 'Notificación a usuario - Préstamo de equipo UTA',
        text: `Usted realizó un préstamo del equipo "${equipment}" de la facultad de la UTA. Tiene hasta el ${dueDate} para devolverlo.`,
      })
      return { success: true, message: 'Correo enviado exitosamente.' }
    } catch (error) {
      Logger.error('Error al enviar correo:', error)
      return { success: false, message: 'Error enviando el correo.', error }
    }
  }

  async sendEmailWithTemplate(email: string, subject: string, content: string) {
    try {
      Logger.log(`Enviando email con template a: ${email}`)

      await this.mailerService.sendMail({
        to: email,
        subject,
        html: content,
        text: content.replace(/<[^>]*>/g, ''), // Versión de texto plano sin HTML
      })

      Logger.log(`Email enviado exitosamente a: ${email}`)
      return { success: true, message: 'Correo enviado exitosamente.' }
    } catch (error) {
      Logger.error(`Error al enviar correo a ${email}:`, error)
      return { success: false, message: 'Error enviando el correo.', error }
    }
  }
}
