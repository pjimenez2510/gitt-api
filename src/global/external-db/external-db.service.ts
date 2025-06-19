import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { ConnectionPool, config as SqlConfig } from 'mssql'
import { CustomConfigService } from '../config/config.service'

export interface ExternalPersonData {
  CEDULA: string
  APELLIDOS: string
  NOMBRES: string
  CORREO: string
  TELELFONO: string
  ROL: string
}

@Injectable()
export class ExternalDbService implements OnModuleDestroy {
  private pool: ConnectionPool
  private readonly logger = new Logger(ExternalDbService.name)

  constructor(private readonly configService: CustomConfigService) {
    const config: SqlConfig = {
      server: this.configService.env.SQLSERVER_SERVER,
      database: this.configService.env.SQLSERVER_DATABASE,
      user: this.configService.env.SQLSERVER_USER,
      password: this.configService.env.SQLSERVER_PASSWORD,
      port: this.configService.env.SQLSERVER_PORT,
      options: {
        encrypt: false, // Puede ser true dependiendo de la configuración del servidor
        trustServerCertificate: true,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    }

    this.pool = new ConnectionPool(config)
  }

  async onModuleDestroy() {
    try {
      await this.pool.close()
      this.logger.log('SQL Server connection pool closed')
    } catch (error) {
      this.logger.error('Error closing SQL Server connection pool:', error)
    }
  }

  private async ensureConnection(): Promise<ConnectionPool> {
    if (!this.pool.connected && !this.pool.connecting) {
      try {
        await this.pool.connect()
        this.logger.log('Connected to SQL Server')
      } catch (error) {
        this.logger.error('Error connecting to SQL Server:', error)
        throw error
      }
    }
    return this.pool
  }

  async findPersonByDni(dni: string): Promise<ExternalPersonData | null> {
    try {
      const pool = await this.ensureConnection()
      const result = await pool
        .request()
        .input('dni', dni)
        .query('SELECT * FROM FISEI.TALLERESFISEI WHERE CEDULA = @dni')

      if (result.recordset.length === 0) {
        return null
      }

      return result.recordset[0] as ExternalPersonData
    } catch (error) {
      this.logger.error(`Error querying person with DNI ${dni}:`, error)
      throw error
    }
  }
}
