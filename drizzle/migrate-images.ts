import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { Logger } from '@nestjs/common'
import { item } from 'drizzle/schema/tables/inventory'
import FormData from 'form-data'
import fetch from 'node-fetch'
import https from 'https'

// Agregar esta configuración para ignorar certificados SSL autofirmados
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

const db = drizzle(process.env.DATABASE_URL ?? '')

// Configuración del API
const API_BASE_URL = 'https://172.21.123.153/api/v1'
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOSVNUUkFUT1IiLCJpYXQiOjE3NTE5MzA1NzUsImV4cCI6MTc1MTkzNzc3NX0.9oLXT5cljVFYWosTlViXRLv6rhWy6r2_7cRz5KpndEg'

interface MigrationResult {
  processed: number
  successful: number
  failed: number
  errors: string[]
}

class ImageMigrator {
  private sourceDir = 'drizzle/data/BIENES'
  private allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']

  private extractCodeFromFilename(filename: string): string | null {
    // Extraer todos los dígitos del nombre del archivo
    const match = filename.match(/(\d+)/)
    if (!match) return null

    const digits = match[1]

    // Si tiene más de 8 dígitos, tomar los últimos 8
    if (digits.length > 8) {
      return digits.slice(-8)
    }

    // Si tiene menos de 8 dígitos, completar con ceros a la izquierda
    return digits.padStart(8, '0')
  }

  private async findItemByCode(
    code: string,
  ): Promise<typeof item.$inferSelect | null> {
    try {
      const result = await db
        .select()
        .from(item)
        .where(eq(item.code, code))
        .limit(1)
        .execute()

      return result.length > 0 ? result[0] : null
    } catch (error) {
      Logger.error(`Error buscando item con código ${code}:`, error)
      return null
    }
  }

  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase()
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg'
      case '.png':
        return 'image/png'
      case '.gif':
        return 'image/gif'
      default:
        return 'application/octet-stream'
    }
  }

  private async uploadImageToAPI(
    itemId: number,
    filePath: string,
    filename: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const formData = new FormData()
      formData.append('itemId', itemId.toString())
      formData.append('file', fs.createReadStream(filePath), {
        filename,
        contentType: this.getContentType(filename),
      })
      formData.append('type', 'PRIMARY')
      formData.append('isPrimary', 'true')
      formData.append('description', `Imagen migrada: ${filename}`)
      formData.append('photoDate', new Date().toISOString().split('T')[0])

      const response = await fetch(`${API_BASE_URL}/item-images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: 'application/json',
          ...formData.getHeaders(),
        },
        body: formData,
        agent: httpsAgent, // Agregar esta línea
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        }
      }

      const result = await response.json()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: `Error en upload: ${error.message}`,
      }
    }
  }

  private async processImageFile(
    filename: string,
    sourcePath: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Extraer código del nombre del archivo
      const code = this.extractCodeFromFilename(filename)
      if (!code) {
        return {
          success: false,
          error: `No se pudo extraer código de: ${filename}`,
        }
      }

      // Buscar item por código
      const itemRecord = await this.findItemByCode(code)
      if (!itemRecord) {
        return {
          success: false,
          error: `No se encontró item con código: ${code}`,
        }
      }

      // Subir imagen usando el API
      const uploadResult = await this.uploadImageToAPI(
        itemRecord.id,
        sourcePath,
        filename,
      )

      if (uploadResult.success) {
        Logger.log(`✅ Imagen subida: ${filename} -> Item ID: ${itemRecord.id}`)
        return { success: true }
      } else {
        return {
          success: false,
          error: `Error subiendo ${filename}: ${uploadResult.error}`,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Error procesando ${filename}: ${error.message}`,
      }
    }
  }

  async migrateImages(): Promise<MigrationResult> {
    const result: MigrationResult = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
    }

    try {
      // Verificar que existe el directorio fuente
      const sourceStats = await stat(this.sourceDir)
      if (!sourceStats.isDirectory()) {
        throw new Error(`El directorio fuente no existe: ${this.sourceDir}`)
      }

      // Leer archivos del directorio fuente
      const files = await readdir(this.sourceDir)
      const imageFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return this.allowedExtensions.includes(ext)
      })

      Logger.log(
        `Encontrados ${imageFiles.length} archivos de imagen en ${this.sourceDir}`,
      )

      // Procesar cada archivo
      for (const filename of imageFiles) {
        result.processed++
        const sourcePath = path.join(this.sourceDir, filename)

        Logger.log(
          `Procesando: ${filename} (${result.processed}/${imageFiles.length})`,
        )

        const processResult = await this.processImageFile(filename, sourcePath)

        if (processResult.success) {
          result.successful++
        } else {
          result.failed++
          result.errors.push(
            processResult.error || `Error desconocido con ${filename}`,
          )
          Logger.error(`❌ ${processResult.error}`)
        }

        // Pequeña pausa entre uploads para no saturar el servidor
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    } catch (error) {
      Logger.error('Error durante la migración:', error)
      result.errors.push(`Error general: ${error.message}`)
    }

    return result
  }
}

async function main() {
  Logger.log('🚀 Iniciando migración de imágenes via API...')

  const migrator = new ImageMigrator()
  const result = await migrator.migrateImages()

  Logger.log('\n📊 Resultados de la migración:')
  Logger.log(`   Procesados: ${result.processed}`)
  Logger.log(`   Exitosos: ${result.successful}`)
  Logger.log(`   Fallidos: ${result.failed}`)

  if (result.errors.length > 0) {
    Logger.log('\n❌ Errores encontrados:')
    result.errors.forEach((error) => Logger.log(`   - ${error}`))
  }

  Logger.log('\n✅ Migración completada')
}

main()
  .then(() => {
    Logger.log('Proceso terminado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    Logger.error('Error en el proceso principal:', error)
    process.exit(1)
  })
