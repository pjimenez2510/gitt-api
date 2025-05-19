import { Logger } from '@nestjs/common'
import { importCSV } from './csv-importer'

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    Logger.error('Debe proporcionar la ruta al archivo CSV')
    Logger.log('Uso: npm run db:import-csv -- <ruta-archivo> [delimitador]')
    Logger.log(
      'Ejemplo: npm run db:import-csv -- drizzle/data/BIENES_FRANKLIN_SALAZAR_FINAL.csv ,',
    )
    process.exit(1)
  }

  const filePath = args[0]
  const delimiter =
    args[1] ||
    (filePath.endsWith('.csv') ? ',' : filePath.endsWith('.tsv') ? '\t' : ',')

  Logger.log(`Iniciando importación del archivo: ${filePath}`)
  Logger.log(`Usando delimitador: "${delimiter || 'auto'}"`)

  try {
    const result = await importCSV(filePath, {
      delimiter,
      headerRowCount: 1,
    })

    if (result.success > 0) {
      Logger.log('='.repeat(50))
      Logger.log('✅ Importación completada con éxito')
      Logger.log(`   - Registros procesados: ${result.total}`)
      Logger.log(`   - Registros importados: ${result.success}`)
      Logger.log(`   - Registros con error: ${result.error}`)
      Logger.log('='.repeat(50))
      process.exit(0)
    } else {
      Logger.error('='.repeat(50))
      Logger.error(
        '❌ Importación fallida. No se importaron registros correctamente.',
      )
      Logger.error(`   - Error: ${result.errorMessage || 'Error desconocido'}`)
      Logger.error('='.repeat(50))
      process.exit(1)
    }
  } catch (error) {
    Logger.error('='.repeat(50))
    Logger.error('❌ Error crítico durante la importación')
    Logger.error(`   - ${(error as Error).message}`)
    Logger.error('='.repeat(50))
    process.exit(1)
  }
}

void main()
