import { Module } from '@nestjs/common'
import { CertificatesService } from './certificates.service'
import { CertificatesController } from './certificates.controller'

@Module({
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
