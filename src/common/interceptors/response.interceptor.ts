import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { ApiRes } from '../types/api-response.interface'
import { Reflector } from '@nestjs/core'
import { getApiMessage } from '../decorators/api-message.decorator'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiRes<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiRes<T>> | Promise<Observable<ApiRes<T>>> {
    return next.handle().pipe(
      map((data) => {
        const message = getApiMessage(this.reflector, context)

        return {
          success: true,
          message,
          data: data ?? null,
        }
      }),
    )
  }
}
