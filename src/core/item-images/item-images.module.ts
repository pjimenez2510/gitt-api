import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { ItemImagesService } from './item-images.service'
import { ItemImagesController } from './item-images.controller'
import { DatabaseModule } from 'src/global/database/database.module'
import * as fs from 'fs'

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
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          const ext = extname(file.originalname).toLowerCase()
          cb(null, `${uniqueSuffix}${ext}`)
        },
      }),
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
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
      },
      preservePath: true,
    }),
  ],
  providers: [ItemImagesService],
  controllers: [ItemImagesController],
  exports: [ItemImagesService],
})
export class ItemImagesModule {}
