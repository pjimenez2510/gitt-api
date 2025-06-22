import { Global, Module } from '@nestjs/common'
import { ExternalDbService } from './external-db.service'

@Global()
@Module({
  providers: [ExternalDbService],
  exports: [ExternalDbService],
})
export class ExternalDbModule {}
