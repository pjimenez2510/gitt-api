import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST!,
        port: Number(process.env.MAIL_PORT!),
        secure: false,
        auth: {
          user: process.env.MAIL_USER!,
          pass: process.env.MAIL_PASS!,
        },
      },
      defaults: {
        from: '"Facturación junta de agua potable" <faqua2085@facturaqua.com>',
      },
    }),
  ],
})
export class EmailModule {}
