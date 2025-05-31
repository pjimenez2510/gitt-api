import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { ItemImagesService } from './item-images.service'
import { ItemImagesController } from './item-images.controller'
import { DatabaseModule } from 'src/global/database/database.module'
import * as fs from 'fs'

// Asegurar que el directorio de uploads exista
const uploadsDir = join(process.cwd(), 'uploads', 'items')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      // Usar almacenamiento en disco
      storage: diskStorage({
        // Especificar directorio de destino
        destination: (req, file, cb) => {
          cb(null, uploadsDir)
        },
        // Generar nombre de archivo único
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          const ext = extname(file.originalname).toLowerCase()
          cb(null, `${uniqueSuffix}${ext}`)
        },
      }),
      // Filtrar por tipo MIME y asegurar que el buffer esté disponible
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
        ]

        if (allowedMimeTypes.includes(file.mimetype)) {
          // Asegurarse de que el buffer esté disponible
          file.buffer = file.buffer || Buffer.alloc(0)
          cb(null, true)
        } else {
          cb(
            new Error(
              'Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF)',
            ),
            false,
          )
        }
      },
      // Límites de carga
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1,
      },
      // Mantener el buffer del archivo
      preservePath: true,
    }),
  ],
  providers: [ItemImagesService],
  controllers: [ItemImagesController],
  exports: [ItemImagesService],
})
export class ItemImagesModule {}
