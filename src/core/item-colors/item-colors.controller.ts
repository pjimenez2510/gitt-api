import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ItemColorsService } from './item-colors.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemColorResDto } from './dto/res/item-color-res.dto'
import { CreateItemColorDto } from './dto/req/create-item-color.dto'
import { UpdateItemColorDto } from './dto/req/update-item-color.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterItemColorDto } from './dto/req/item-color-filter.dto'

@ApiTags('Item Colors')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('item-colors')
export class ItemColorsController {
  constructor(private readonly service: ItemColorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los colores de ítems con filtros',
  })
  @ApiPaginatedResponse(ItemColorResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterItemColorDto) {
    req.action = 'item-colors:find-all-filters:attempt'
    req.logMessage = 'Obteniendo colores de ítems con filtros'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'item-colors:find-all-filters:success'
      req.logMessage = `Se obtuvieron ${result.records.length} colores de ítems`
      return result
    } catch (error) {
      req.action = 'item-colors:find-all-filters:failed'
      req.logMessage = `Error al obtener colores de ítems: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un detalle color de ítem por id',
  })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'item-colors:find-one:attempt'
    req.logMessage = `Buscando color de ítem con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'item-colors:find-one:success'
      req.logMessage = `Color de ítem encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-colors:find-one:failed'
      req.logMessage = `Error al buscar color de ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo color de ítem',
  })
  @ApiBody({ type: CreateItemColorDto })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateItemColorDto) {
    req.action = 'item-colors:create:attempt'
    req.logMessage = `Creando nuevo color para el ítem ID: ${dto.itemId}`

    try {
      const result = await this.service.create(dto)
      req.action = 'item-colors:create:success'
      req.logMessage = `Color de ítem creado con ID: ${result.id} para el ítem ID: ${dto.itemId}`
      return result
    } catch (error) {
      req.action = 'item-colors:create:failed'
      req.logMessage = `Error al crear color para el ítem ID ${dto.itemId}: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un color de ítem por id',
  })
  @ApiBody({ type: UpdateItemColorDto })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemColorDto,
  ) {
    req.action = 'item-colors:update:attempt'
    req.logMessage = `Actualizando color de ítem con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'item-colors:update:success'
      req.logMessage = `Color de ítem actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-colors:update:failed'
      req.logMessage = `Error al actualizar color de ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un color de ítem por id',
  })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'item-colors:remove:attempt'
    req.logMessage = `Eliminando color de ítem con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'item-colors:remove:success'
      req.logMessage = `Color de ítem eliminado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-colors:remove:failed'
      req.logMessage = `Error al eliminar color de ítem ID ${id}: ${error.message}`
      throw error
    }
  }
}
