import { Logger } from '@nestjs/common'
import { processCSV } from './processors/csv-processor'
import { CSVOptions, ProcessCSVResult } from './types'

/**
 * Función principal para importar datos de un archivo CSV al sistema
 * @param filePath Ruta al archivo CSV
 * @param options Opciones para el procesamiento del CSV
 * @returns Resultado del procesamiento con estadísticas
 */
export async function importCSV(
  filePath: string,
  options?: CSVOptions,
): Promise<ProcessCSVResult> {
  Logger.log('Iniciando importación de CSV')

  try {
    // Procesar el archivo CSV
    const result = await processCSV(filePath, options)

    Logger.log(
      `Importación completada: ${result.success} éxitos, ${result.error} errores, ${result.total} total`,
    )

    return result
  } catch (error) {
    Logger.error(`Error durante la importación: ${(error as Error).message}`)
    return {
      success: 0,
      error: 0,
      total: 0,
      errorMessage: (error as Error).message,
    }
  }
}

// Permitir ejecución directa desde línea de comandos
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    Logger.error('Debe proporcionar la ruta al archivo CSV')
    Logger.log(
      'Uso: node -r tsx/register drizzle/data/csv-importer/index.ts <ruta-archivo> [delimitador]',
    )
    process.exit(1)
  }

  const filePath = args[0]
  const delimiter = args[1] || ','

  importCSV(filePath, { delimiter, headerRowCount: 1 })
    .then((result) => {
      if (result.success > 0) {
        Logger.log(`Importación exitosa de ${result.success} registros`)
        process.exit(0)
      } else {
        Logger.error(
          `No se importaron registros correctamente: ${result.errorMessage || 'Error desconocido'}`,
        )
        process.exit(1)
      }
    })
    .catch((error) => {
      Logger.error(`Error al ejecutar la importación: ${error.message}`)
      process.exit(1)
    })
}

// Exportaciones principales
export * from './types'
export * from './processors/csv-processor'
