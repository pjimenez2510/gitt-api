import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IConfig } from './types'

@Injectable()
export class CustomConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): IConfig {
    return (
      this.configService.get<IConfig>('APP') ?? {
        PORT: 3000,
        DATABASE_URL: '',
        JWT_SECRET: '',
      }
    )
  }
}
