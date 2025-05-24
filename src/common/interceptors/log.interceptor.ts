import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { LogService } from 'src/global/log/log.service'

@Injectable()
export class LogInterceptor<T> implements NestInterceptor {
  constructor(private readonly logsService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const userId = req.user?.id || null // <-- Aquí obtienes el userId
    const endpoint = req.url
    const method = req.method
    const ip = req.ip

    const userAgent = req.headers['user-agent']

    return next.handle().pipe(
      tap(() => {
        void this.logsService.createLog({
          userId,
          endpoint,
          method,
          action: req.action || null,
          message: req.logMessage || null,
          statusCode: res.statusCode, // <-- Aquí obtienes el status code real
          ip,
          userAgent,
        })
      }),
    )
  }
}
