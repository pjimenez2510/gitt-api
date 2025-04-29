import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { IApiMessage } from '../types/api-response.interface'
import { Reflector } from '@nestjs/core'

export const API_MESSAGE_METADATA = 'apiMessage'

export const ApiMessage = (messages: string | string[], displayable = true) =>
  SetMetadata<string, IApiMessage>(API_MESSAGE_METADATA, {
    content: Array.isArray(messages) ? messages : [messages],
    displayable,
  })

export const getApiMessage = (
  reflector: Reflector,
  context: ExecutionContext,
  defaultMessage: IApiMessage = {
    content: ['Operación exitosa'],
    displayable: false,
  },
) =>
  reflector.get<IApiMessage>(API_MESSAGE_METADATA, context.getHandler()) ||
  defaultMessage
