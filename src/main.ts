import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { GlobalExceptionFilter } from './common/filters/all-exception.filter'
import { useContainer } from 'class-validator'
import { CustomConfigService } from './global/config/config.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiPaginatedRes, ApiRes } from './common/types/api-response.interface'
import { BaseParamsDto } from './common/dtos/base-params.dto'
import { LogInterceptor } from './common/interceptors/log.interceptor'
import { join } from 'path'
import { json, urlencoded } from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
    cors: true,
  })

  app.use(json({ limit: '10mb' }))
  app.use(urlencoded({ extended: true, limit: '10mb' }))

  const configService = app.get(CustomConfigService)
  const port = configService.env.PORT

  app.enableCors('*')
  app.getHttpAdapter().getInstance().set('trust proxy', true)
  app.getHttpAdapter().useStaticAssets!(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalInterceptors(app.get(ResponseInterceptor))
  app.useGlobalInterceptors(app.get(LogInterceptor))

  app.useGlobalFilters(new GlobalExceptionFilter())
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('GITT API REST')
    .setDescription(
      'Complete API documentation for the GITT application. This API is designed to provide a comprehensive set of endpoints for managing and interacting with the GITT application.',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT token',
      in: 'header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ApiRes, ApiPaginatedRes, BaseParamsDto],
  })

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
    customSiteTitle: 'GITT API Documentation',
    customCss: `
      .swagger-ui .information-container { padding: 20px 0 }
      .swagger-ui .scheme-container { padding: 15px 0 }
    `,
  })

  await app.listen(port)
  Logger.log(`Server running on port ${port}`, 'Bootstrap')
  Logger.log(
    `Swagger docs available at: http://localhost:${port}/api/docs`,
    'Bootstrap',
  )
  Logger.log(
    'API versioning enabled. Use /api/v1/ to access the API.',
    'Bootstrap',
  )
}

void bootstrap()
