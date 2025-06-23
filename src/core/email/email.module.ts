import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { CustomConfigService } from 'src/global/config/config.service'

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [CustomConfigService],
      useFactory: (configService: CustomConfigService) => ({
        transport: {
          host: configService.env.MAIL_HOST,
          port: configService.env.MAIL_PORT,
          secure: true,
          auth: {
            user: configService.env.MAIL_USER,
            pass: configService.env.MAIL_PASS,
          },
        },
        defaults: {
          from: '"Sistema de Préstamos UTA" <noreply@uta.edu.ec>',
        },
      }),
    }),
  ],
})
export class EmailModule { }
