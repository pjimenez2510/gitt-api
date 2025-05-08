import { Logger } from '@nestjs/common'
import { processCSV } from './csv-importer'

const main = async () => {
  const args = process.argv.slice(2)

  // Validar argumentos
  if (args.length === 0) {
    Logger.error(
      'Uso: npm run db:import-csv <ruta-al-archivo-csv> [delimitador]',
    )
    Logger.log('Ejemplo: npm run db:import-csv ./datos.csv ","')
    Logger.log(
      'Por defecto se usará el archivo drizzle/data/BIENES_FRANKLIN_SALAZAR_FINAL.csv y el delimitador ","',
    )
    return
  }

  const filePath = args[0]
  const delimiter = args[1] || ','

  try {
    const result = await processCSV(filePath, { delimiter, headerRowCount: 1 })
    Logger.log(`Importación completada exitosamente: ${JSON.stringify(result)}`)
  } catch (error) {
    Logger.error(`Error durante la importación: ${error.message}`)
    process.exit(1)
  }
}

void main()
