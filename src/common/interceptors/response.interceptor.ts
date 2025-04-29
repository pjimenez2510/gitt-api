import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { IApiRes } from '../types/api-response.interface'
import { Reflector } from '@nestjs/core'
import { getApiMessage } from '../decorators/api-message.decorator'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiRes<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IApiRes<T>> | Promise<Observable<IApiRes<T>>> {
    return next.handle().pipe(
      map((data) => {
        const message = getApiMessage(this.reflector, context)

        return {
          success: true,
          message,
          data: data || null,
        }
      }),
    )
  }
}
