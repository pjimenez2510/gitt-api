import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
  Req,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { ItemImagesService } from './item-images.service'
import { CreateItemImageDto } from './dto/req/create-item-image.dto'
import { ItemImageResDto } from './dto/res/item-image-res.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { Request } from 'express'

@ApiTags('Item Images')
@Controller('item-images')
@ApiBearerAuth()
export class ItemImagesController {
  constructor(private readonly itemImagesService: ItemImagesService) {}

  @Post('upload')
  @Auth(
    USER_TYPE.ADMINISTRATOR,
    USER_TYPE.MANAGER,
    USER_TYPE.TEACHER,
    USER_TYPE.STUDENT,
  )
  @ApiOperation({ summary: 'Subir una imagen para un ítem' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      preservePath: true,
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBody({ type: CreateItemImageDto })
  @ApiStandardResponse(ItemImageResDto, HttpStatus.CREATED)
  async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Omit<CreateItemImageDto, 'file' | 'filePath'>,
  ): Promise<ItemImageResDto> {
    req.action = 'item-images:upload-file:attempt'
    req.logMessage = 'Subiendo archivo'
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo')
    }
    if (body.photoDate === '') {
      body.photoDate = new Date().toISOString()
    }

    if (!file.buffer || file.size === 0) {
      Logger.error('Archivo vacío o sin buffer:', {
        originalname: file.originalname,
        size: file.size,
        hasBuffer: !!file.buffer,
      })
      throw new BadRequestException(
        'El archivo está vacío o no se pudo leer correctamente',
      )
    }

    if (!file.path) {
      Logger.error('El archivo no tiene ruta de guardado:', file)
      throw new InternalServerErrorException('Error al procesar el archivo')
    }

    try {
      const itemImageData = {
        ...body,
        itemId: Number(body.itemId),
        isPrimary: body.isPrimary === true,
        file,
      }

      const result = await this.itemImagesService.create(itemImageData)
      req.action = 'item-images:upload-file:success'
      req.logMessage = `Imagen agregada correctamente con la ruta ${result.filePath}`
      return result
    } catch (error) {
      req.action = 'item-types:create:failed'
      req.logMessage = `Error al crear tipo de ítem: ${error.message}`
      throw error
    }
  }
}
