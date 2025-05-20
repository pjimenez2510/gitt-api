import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'
import { CustomConfigService } from '../config/config.service'
import { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool
  public readonly db: PgDatabase<PgQueryResultHKT, typeof schema>
  private readonly logger = new Logger(DatabaseService.name)

  constructor(private readonly configService: CustomConfigService) {
    this.pool = new Pool({
      connectionString: this.configService.env.DATABASE_URL,
    })
    this.db = drizzle(this.pool, { schema })
  }

  onModuleInit() {
    // Puedes ejecutar lógica de inicialización si es necesario
    this.logger.log('Database connection initialized')
  }

  async onModuleDestroy() {
    await this.pool.end()
    this.logger.log('Database connection closed')
  }

  // Método helper para transacciones
  async transaction<T>(
    callback: (tx: ReturnType<typeof drizzle>) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const tx = drizzle(client, { schema })
      const result = await callback(tx)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
