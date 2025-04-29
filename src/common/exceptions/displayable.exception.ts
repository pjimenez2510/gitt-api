import { HttpException } from '@nestjs/common'

export class DisplayableException extends HttpException {
  constructor(message: string | string[], statusCode: number) {
    super(message, statusCode)
  }
}
