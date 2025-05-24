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
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ItemMaterialsService } from './item-materials.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemMaterialResDto } from './dto/res/item-material-res.dto'
import { CreateItemMaterialDto } from './dto/req/create-item-material.dto'
import { UpdateItemMaterialDto } from './dto/req/update-item-material.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'

@ApiTags('Item Materials')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('item-materials')
export class ItemMaterialsController {
  constructor(private readonly service: ItemMaterialsService) {}

  @Get('item/:id')
  @ApiOperation({
    summary: 'Obtener todos los detalles de materiales de un ítem',
  })
  @ApiPaginatedResponse(ItemMaterialResDto, HttpStatus.OK)
  async findAll(
    @Req() req: Request,
    @Param('id', ParseIntPipe) itemId: number,
    @Query() paginationDto: BaseParamsDto,
  ) {
    req.action = 'item-materials:find-all:attempt'
    req.logMessage = `Obteniendo materiales para el ítem ID: ${itemId}`

    try {
      const result = await this.service.findByItemId(paginationDto, itemId)
      req.action = 'item-materials:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} materiales para el ítem ID: ${itemId}`
      return result
    } catch (error) {
      req.action = 'item-materials:find-all:failed'
      req.logMessage = `Error al obtener materiales para el ítem ID ${itemId}: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un detalle material de ítem por id',
  })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'item-materials:find-one:attempt'
    req.logMessage = `Buscando material de ítem con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'item-materials:find-one:success'
      req.logMessage = `Material de ítem encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-materials:find-one:failed'
      req.logMessage = `Error al buscar material de ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo material para un ítem',
  })
  @ApiBody({ type: CreateItemMaterialDto })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateItemMaterialDto) {
    req.action = 'item-materials:create:attempt'
    req.logMessage = `Creando nuevo material para el ítem ID: ${dto.itemId}`

    try {
      const result = await this.service.create(dto)
      req.action = 'item-materials:create:success'
      req.logMessage = `Material de ítem creado con ID: ${result.id} para el ítem ID: ${dto.itemId}`
      return result
    } catch (error) {
      req.action = 'item-materials:create:failed'
      req.logMessage = `Error al crear material para el ítem ID ${dto.itemId}: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un material de ítem por id',
  })
  @ApiBody({ type: UpdateItemMaterialDto })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemMaterialDto,
  ) {
    req.action = 'item-materials:update:attempt'
    req.logMessage = `Actualizando material de ítem con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'item-materials:update:success'
      req.logMessage = `Material de ítem actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-materials:update:failed'
      req.logMessage = `Error al actualizar material de ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un material de ítem por id',
  })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'item-materials:remove:attempt'
    req.logMessage = `Eliminando material de ítem con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'item-materials:remove:success'
      req.logMessage = `Material de ítem eliminado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-materials:remove:failed'
      req.logMessage = `Error al eliminar material de ítem ID ${id}: ${error.message}`
      throw error
    }
  }
}
