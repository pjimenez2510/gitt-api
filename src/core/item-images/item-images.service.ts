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

// Promisify fs methods
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

@Injectable()
export class ItemImagesService {
  constructor(private readonly dbService: DatabaseService) {}

  private async ensureUploadsDirectory(itemId: number): Promise<string> {
    const basePath = join(process.cwd(), 'uploads', 'items', itemId.toString())

    // Crear el directorio del ítem si no existe
    try {
      await mkdirAsync(basePath, { recursive: true })
      return basePath
    } catch {
      throw new MethodNotAllowedException(
        'Error al preparar el directorio de destino',
      )
    }
  }

  private generateUniqueFilename(originalname: string): string {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = extname(originalname).toLowerCase()
    return `${uniqueSuffix}${ext}`
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
    //Logger.log(createItemImageDto)

    const { itemId } = createItemImageDto
    let tempFilePath = createItemImageDto.file.path

    try {
      // Verificar que el ítem existe
      const itemExists = await this.dbService.db.query.item.findFirst({
        where: eq(item.id, itemId),
      })

      if (!itemExists) {
        throw new NotFoundException(`No se encontró el ítem con ID ${itemId}`)
      }

      // Si se marca como principal, desmarcar cualquier otra imagen principal del ítem
      if (createItemImageDto.isPrimary) {
        await this.dbService.db
          .update(itemImage)
          .set({ isPrimary: false })
          .where(eq(itemImage.itemId, itemId))
      }

      // Crear directorio de destino si no existe
      await this.ensureUploadsDirectory(itemId)
      const uniqueFilename = this.generateUniqueFilename(
        createItemImageDto.file.originalname,
      )
      const relativePath = `uploads/items/${itemId}/${uniqueFilename}`
      const fullPath = join(process.cwd(), relativePath)

      // Verificar que el archivo temporal existe
      if (!tempFilePath || !fs.existsSync(tempFilePath)) {
        throw new InternalServerErrorException('El archivo temporal no existe')
      }

      // Mover el archivo a la ubicación final
      try {
        await renameAsync(tempFilePath, fullPath)
        tempFilePath = fullPath // Actualizar la ruta temporal a la ruta final
      } catch {
        throw new InternalServerErrorException('Error al guardar el archivo')
      }

      // Crear el registro en la base de datos
      const [newImage] = await this.dbService.db
        .insert(itemImage)
        .values({
          itemId,
          filePath: relativePath,
          type: createItemImageDto.type,
          isPrimary: createItemImageDto.isPrimary || false,
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

      // Si hay un error, intentar eliminar el archivo subido
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
