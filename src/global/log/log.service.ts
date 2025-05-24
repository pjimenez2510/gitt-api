import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { log } from 'drizzle/schema'

@Injectable()
export class LogService {
  constructor(private readonly dbService: DatabaseService) {}

  async createLog(logData: {
    userId: number
    endpoint: string
    method: string
    action?: string
    statusCode?: number
    message?: string
    ip?: string
    userAgent?: string
  }) {
    const { userId, ...data } = logData

    await this.dbService.db
      .insert(log)
      .values({
        userId,
        ...data,
      })
      .execute()
  }
}
