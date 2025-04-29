import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { GlobalExceptionFilter } from './common/filters/all-exception.filter'
import { useContainer } from 'class-validator'
import { CustomConfigService } from './global/config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.enableCors('*')
  app.useGlobalInterceptors(app.get(ResponseInterceptor))
  app.useGlobalFilters(new GlobalExceptionFilter())
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const configService = app.get(CustomConfigService)
  const port = configService.env.PORT
  await app.listen(port)

  Logger.log(`Server running on port ${port}`, 'Bootstrap')
}

void bootstrap()
