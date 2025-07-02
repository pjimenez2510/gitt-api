import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common'
import * as fs from 'fs'
import { join, extname } from 'path'
import { promisify } from 'util'

const renameAsync = promisify(fs.rename)
const mkdirAsync = promisify(fs.mkdir)
const unlinkAsync = promisify(fs.unlink)

import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemImageDto } from './dto/req/create-item-image.dto'
import { plainToInstance } from 'class-transformer'
import { ItemImageResDto } from './dto/res/item-image-res.dto'
import { eq } from 'drizzle-orm'
import { itemImage, item } from 'drizzle/schema'
import { itemImageColumnsAndWith } from './const/item-image-columns-and-with'
import { randomBytes } from 'crypto'

@Injectable()
export class ItemImagesService {
  constructor(private readonly dbService: DatabaseService) {}

  private async ensureUploadsDirectory(itemId: number): Promise<string> {
    const basePath = join(process.cwd(), 'uploads', 'items', itemId.toString())

    try {
      await mkdirAsync(basePath, { recursive: true })
      Logger.log(join(__dirname, '..', 'uploads'), 'StaticAssetsPath')
      return basePath
    } catch {
      throw new MethodNotAllowedException(
        'Error al preparar el directorio de destino',
      )
    }
  }

  private generateUniqueFilename(originalname: string): string {
    const randomString = randomBytes(16).toString('hex')
    const timestamp = Date.now()
    const ext = extname(originalname).toLowerCase()
    return `${timestamp}-${randomString}${ext}`
  }

  async remove(id: number) {
    try {
      // First get the image to get the file path
      const image = await this.dbService.db.query.itemImage.findFirst({
        where: eq(itemImage.id, id),
      })

      if (!image) {
        throw new NotFoundException(`No se encontró la imagen con ID ${id}`)
      }

      // Delete from database
      await this.dbService.db.delete(itemImage).where(eq(itemImage.id, id))

      // Delete file from filesystem if it exists
      const filePath = join(process.cwd(), image.filePath)
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath).catch((error) => {
          Logger.error(`Error al eliminar el archivo ${filePath}:`, error)
          // Don't throw error if file deletion fails, as the DB record is already deleted
        })
      }
      //Logger.log(image)
      // Check if directory is empty and remove it if it is
      const directory = join(
        process.cwd(),
        'uploads',
        'items',
        image.itemId.toString(),
      )
      try {
        const files = fs.readdirSync(directory)
        if (files.length === 0) {
          fs.rmSync(directory, { recursive: true })
        }
      } catch (error) {
        Logger.error(
          `Error al verificar/eliminar el directorio ${directory}:`,
          error,
        )
      }

      return plainToInstance(ItemImageResDto, image)
    } catch (error) {
      Logger.error(`Error al eliminar la imagen con ID ${id}:`, error)
      throw new InternalServerErrorException(
        `Error al eliminar la imagen: ${error.message}`,
      )
    }
  }

  async findOne(id: number): Promise<ItemImageResDto> {
    const itemImageResult = await this.dbService.db.query.itemImage.findFirst({
      where: eq(itemImage.id, id),
      columns: itemImageColumnsAndWith.columns,
      with: {
        ...itemImageColumnsAndWith.with,
      },
    })

    if (!itemImageResult) {
      throw new NotFoundException(`ItemImage con id ${id} no encontrado`)
    }

    return plainToInstance(ItemImageResDto, itemImageResult)
  }

  async create(
    createItemImageDto: CreateItemImageDto,
  ): Promise<ItemImageResDto> {
    const { itemId } = createItemImageDto
    let tempFilePath = createItemImageDto.file.path
    Logger.log(tempFilePath)
    try {
      const itemExists = await this.dbService.db.query.item.findFirst({
        where: eq(item.id, itemId),
      })

      if (!itemExists) {
        throw new NotFoundException(`No se encontró el ítem con ID ${itemId}`)
      }

      if (createItemImageDto.isPrimary) {
        await this.dbService.db
          .update(itemImage)
          .set({ isPrimary: false })
          .where(eq(itemImage.itemId, itemId))
      }

      await this.ensureUploadsDirectory(itemId)
      const uniqueFilename = this.generateUniqueFilename(
        createItemImageDto.file.originalname,
      )
      const relativePath = `uploads/items/${itemId}/${uniqueFilename}`
      const fullPath = join(process.cwd(), relativePath)

      if (!tempFilePath || !fs.existsSync(tempFilePath)) {
        throw new InternalServerErrorException('El archivo temporal no existe')
      }

      try {
        await renameAsync(tempFilePath, fullPath)
        tempFilePath = fullPath
      } catch {
        throw new InternalServerErrorException('Error al guardar el archivo')
      }

      const [newImage] = await this.dbService.db
        .insert(itemImage)
        .values({
          itemId,
          filePath: relativePath,
          type: createItemImageDto.type,
          isPrimary: createItemImageDto.isPrimary ?? false,
          description: createItemImageDto.description,
          photoDate: createItemImageDto.photoDate,
        })
        .returning({ id: itemImage.id })
        .execute()

      return this.findOne(newImage.id)
    } catch (error) {
      Logger.error(
        `Error al crear la imagen para el ítem ${itemId}:`,
        error.stack,
      )

      if (tempFilePath) {
        try {
          if (fs.existsSync(tempFilePath)) {
            await unlinkAsync(tempFilePath)
            Logger.log(`Archivo temporal eliminado: ${tempFilePath}`)
          }
        } catch (fsError) {
          Logger.error(
            `Error al eliminar el archivo ${tempFilePath} después de un error:`,
            fsError,
          )
        }
      }

      throw new InternalServerErrorException(
        'Error al procesar la imagen del ítem',
      )
    }
  }
}
