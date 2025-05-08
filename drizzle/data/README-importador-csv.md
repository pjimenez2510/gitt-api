# Importador de CSV para Inventario

Este módulo permite importar datos de inventario desde archivos CSV a la base de datos del sistema.

## Características

- Importación de bienes/activos desde CSV
- Mapeo flexible de nombres de columnas 
- Soporte para diferentes formatos de fecha
- Manejo automático de tipos de bienes, colores, materiales, ubicaciones, etc.
- Reportes detallados de la importación

## Uso básico

### Importar el CSV de ejemplo (Franklin Salazar)

```bash
npm run db:load-franklin-csv
```

Este comando cargará el archivo CSV de bienes de Franklin Salazar que se encuentra en `drizzle/data/BIENES_FRANKLIN_SALAZAR_FINAL.csv`.

### Importar un CSV personalizado

```bash
npm run db:import-csv <ruta-al-archivo> [delimitador]
```

Donde:
- `<ruta-al-archivo>`: Ruta al archivo CSV a importar
- `[delimitador]`: Opcional. Delimitador usado en el CSV (por defecto: "," - coma)

Ejemplo:
```bash
npm run db:import-csv ./mis-activos.csv ";"
```

## Formato del CSV

El sistema reconoce múltiples formatos de cabeceras para los campos más comunes. Algunos ejemplos:

| Dato | Nombres de columna reconocidos |
|------|--------------------------------|
| Código | "Código del Bien", "Código", "Code", "ID" |
| Nombre | "Bien", "Nombre", "Name", "Item Name" |
| Tipo | "(BLD) o (BCA)", "Item Type", "Tipo Bien" |
| Ubicación | "Ubicación de Bodega", "Location", "Ubicación" |
| Valor | "Valor de Compra", "Purchase Value", "Valor" |

## Validaciones y valores por defecto

- Si no se encuentra un tipo de bien, se usará "BLD" (Bienes de lujo)
- Si no se encuentra un estado, se usará "Activo"
- Si no se encuentra una condición, se usará "BUENO"
- Si no se encuentra una categoría, se usará la primera disponible o se creará "OTROS"
- Si no existe una bodega o ubicación, se creará automáticamente

## Integración programática

También puedes usar el importador desde tu propio código:

```typescript
import { processCSV } from './drizzle/data/csv-importer'

async function importarMiArchivo() {
  try {
    const result = await processCSV('./mi-archivo.csv', { 
      delimiter: ',', 
      headerRowCount: 1 
    })
    
    console.log(`Importados ${result.success} de ${result.total} registros`)
  } catch (error) {
    console.error('Error al importar:', error.message)
  }
}
```

## Consejos para preparar tu CSV

1. Asegúrate de que tu CSV tiene una fila de encabezado
2. Verifica que los nombres de las columnas sean consistentes
3. Las fechas pueden estar en formato DD/MM/YYYY o YYYY-MM-DD
4. Para campos booleanos, se aceptan "S", "true", "SI", "Y" como verdadero

## Solución de problemas

Si encuentras errores durante la importación:

1. Verifica que el archivo CSV existe y es accesible
2. Comprueba el formato del delimitador (coma, punto y coma, etc.)
3. Verifica que los datos cumplen con las restricciones de la base de datos
4. Revisa los logs para ver los errores específicos de cada registro 