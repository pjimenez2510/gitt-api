import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { DisplayableException } from '../exceptions/displayable.exception'
import { ApiRes } from '../types/api-response.interface'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    const errorResponse: ApiRes<null> = {
      success: false,
      message: {
        content: ['Ocurrió un error inesperado'],
        displayable: true,
      },
      data: null,
    }
    const rest =
      exception && typeof exception === 'object' ? { ...exception } : {}

    Logger.error({
      exception: rest,
      path: request.url,
      method: request.method,
      timestamp: new Date().toLocaleString(),
    })

    if (exception instanceof DisplayableException) {
      status = exception.getStatus()
      errorResponse.message.content = Array.isArray(exception.getResponse())
        ? (exception.getResponse() as string[])
        : [exception.getResponse() as string]
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const errorMessage = exception.getResponse()

      errorResponse.message.displayable = false

      errorResponse.message.content = Array.isArray(errorMessage['message'])
        ? errorMessage['message']
        : [errorMessage['message'] ?? 'HTTP Error']
    } else if (exception instanceof Error) {
      errorResponse.message.displayable = false

      errorResponse.message.content = [exception.message]
    }

    response.status(status).json(errorResponse)
  }
}
