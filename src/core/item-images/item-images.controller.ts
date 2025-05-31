import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { ItemImagesService } from './item-images.service'
import { CreateItemImageDto } from './dto/req/create-item-image.dto'
import { ItemImageResDto } from './dto/res/item-image-res.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Item Images')
@Controller('item-images')
export class ItemImagesController {
  private readonly logger = new Logger(ItemImagesController.name)

  constructor(private readonly itemImagesService: ItemImagesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Subir una imagen para un ítem' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      preservePath: true,
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBody({
    description: 'Subir una imagen para un ítem',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Archivo de imagen a subir (PNG, JPEG, JPG, GIF, máximo 5MB)',
        },
        itemId: {
          type: 'number',
          description: 'ID del ítem al que pertenece la imagen',
          example: 1,
        },
        type: {
          type: 'string',
          enum: ['PRIMARY', 'SECONDARY', 'DETAIL'],
          description: 'Tipo de imagen',
          example: 'PRIMARY',
        },
        isPrimary: {
          type: 'boolean',
          description: 'Indica si es la imagen principal del ítem',
          example: true,
        },
        description: {
          type: 'string',
          description: 'Descripción de la imagen',
          example: 'Imagen frontal del ítem',
        },
      },
      required: ['file', 'itemId'],
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Omit<CreateItemImageDto, 'file' | 'filePath'>,
  ): Promise<ItemImageResDto> {
    // Verificar que se haya subido un archivo
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo')
    }

    // Loggear información del archivo recibido
    this.logger.log('Información del archivo recibido:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      fieldname: file.fieldname,
      encoding: file.encoding,
      path: file.path,
      buffer: file.buffer
        ? `Buffer de ${file.buffer.length} bytes`
        : 'No hay buffer',
    })

    // Verificar que el archivo tenga datos
    if (!file.buffer || file.size === 0) {
      this.logger.error('Archivo vacío o sin buffer:', {
        originalname: file.originalname,
        size: file.size,
        hasBuffer: !!file.buffer,
      })
      throw new BadRequestException(
        'El archivo está vacío o no se pudo leer correctamente',
      )
    }

    // Verificar que el archivo se haya guardado correctamente
    if (!file.path) {
      this.logger.error('El archivo no tiene ruta de guardado:', file)
      throw new InternalServerErrorException('Error al procesar el archivo')
    }

    try {
      // Crear el DTO con los datos del archivo
      const itemImageData = {
        ...body,
        itemId: Number(body.itemId),
        isPrimary: body.isPrimary === true,
        file: {
          ...file,
          buffer: file.buffer,
        },
      }

      // Llamar al servicio para crear la imagen
      return await this.itemImagesService.create({
        ...itemImageData,
        file,
      })
    } catch (error) {
      this.logger.error('Error al procesar la carga de la imagen:', error)
      throw error
    }
  }
}
