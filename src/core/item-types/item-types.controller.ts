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
import { ItemTypesService } from './item-types.service'
import { CreateItemTypeDto } from './dto/req/create-item-type.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemTypeResDto } from './dto/res/item-type-res.dto'
import { UpdateItemTypeDto } from './dto/req/update-item-type.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterItemTypeDto } from './dto/req/item-type-filter.dto'

@ApiTags('Item Types')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('item-types')
export class ItemTypesController {
  constructor(private readonly service: ItemTypesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de ítems',
  })
  @ApiPaginatedResponse(ItemTypeResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterItemTypeDto) {
    req.action = 'item-types:find-all:attempt'
    req.logMessage = 'Obteniendo todos los tipos de ítems'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'item-types:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} tipos de ítems`
      return result
    } catch (error) {
      req.action = 'item-types:find-all:failed'
      req.logMessage = `Error al obtener tipos de ítems: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de ítem por id',
  })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'item-types:find-one:attempt'
    req.logMessage = `Buscando tipo de ítem con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'item-types:find-one:success'
      req.logMessage = `Tipo de ítem encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-types:find-one:failed'
      req.logMessage = `Error al buscar tipo de ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de ítem',
  })
  @ApiBody({ type: CreateItemTypeDto })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateItemTypeDto) {
    req.action = 'item-types:create:attempt'
    req.logMessage = `Creando nuevo tipo de ítem: ${dto.name}`

    try {
      const result = await this.service.create(dto)
      req.action = 'item-types:create:success'
      req.logMessage = `Tipo de ítem creado con ID: ${result.id}, Nombre: ${dto.name}`
      return result
    } catch (error) {
      req.action = 'item-types:create:failed'
      req.logMessage = `Error al crear tipo de ítem: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de ítem por id',
  })
  @ApiBody({ type: UpdateItemTypeDto })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemTypeDto,
  ) {
    req.action = 'item-types:update:attempt'
    req.logMessage = `Actualizando tipo de ítem con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'item-types:update:success'
      req.logMessage = `Tipo de ítem actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-types:update:failed'
      req.logMessage = `Error al actualizar tipo de ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de ítem por id',
  })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'item-types:remove:attempt'
    req.logMessage = `Eliminando tipo de ítem con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'item-types:remove:success'
      req.logMessage = `Tipo de ítem eliminado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'item-types:remove:failed'
      req.logMessage = `Error al eliminar tipo de ítem ID ${id}: ${error.message}`
      throw error
    }
  }
}
