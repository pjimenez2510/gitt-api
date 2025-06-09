import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { ItemImagesService } from './item-images.service'
import { ItemImagesController } from './item-images.controller'
import { DatabaseModule } from 'src/global/database/database.module'
import * as fs from 'fs'
import { randomBytes } from 'crypto'

const MAX_FILE_SIZE = 8000000 // 8MB limit
const tempDir = join(process.cwd(), 'temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, tempDir)
        },
        filename: (req, file, cb) => {
          const randomString = randomBytes(16).toString('hex')
          const timestamp = Date.now()
          const ext = extname(file.originalname).toLowerCase()
          cb(null, `${timestamp}-${randomString}${ext}`)
        },
      }),
      // Límites de carga
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
      },
      // Filtrar por tipo MIME y asegurar que el buffer esté disponible
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
        ]

        if (allowedMimeTypes.includes(file.mimetype)) {
          file.buffer = file.buffer ?? Buffer.alloc(0)
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

      // Mantener el buffer del archivo
      preservePath: true,
    }),
  ],
  providers: [ItemImagesService],
  controllers: [ItemImagesController],
  exports: [ItemImagesService],
})
export class ItemImagesModule {}
