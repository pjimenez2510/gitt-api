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
import { CreateItemDto } from './dto/req/create-item.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemResDto } from './dto/res/item-res.dto'
import { UpdateItemDto } from './dto/req/update-item.dto'
import { ItemsService } from './items.service'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { GetUser } from 'src/core/auth/decorators/get-user.decorator'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterItemDto } from './dto/req/filter-item.dto'

@ApiTags('Items')
@Controller('items')
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  @Auth(
    USER_TYPE.ADMINISTRATOR,
    USER_TYPE.MANAGER,
    USER_TYPE.TEACHER,
    USER_TYPE.STUDENT,
  )
  @ApiOperation({
    summary: 'Obtener todos los items',
  })
  @ApiPaginatedResponse(ItemResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterItemDto) {
    req.action = 'items:find-all:attempt'
    req.logMessage = 'Obteniendo todos los ítems'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'items:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} ítems`
      return result
    } catch (error) {
      req.action = 'items:find-all:failed'
      req.logMessage = `Error al obtener ítems: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @Auth(
    USER_TYPE.ADMINISTRATOR,
    USER_TYPE.MANAGER,
    USER_TYPE.TEACHER,
    USER_TYPE.STUDENT,
  )
  @ApiOperation({
    summary: 'Obtener un item por id',
  })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'items:find-one:attempt'
    req.logMessage = `Buscando ítem con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'items:find-one:success'
      req.logMessage = `Ítem encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'items:find-one:failed'
      req.logMessage = `Error al buscar ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Crear un nuevo item',
  })
  @ApiBody({ type: CreateItemDto })
  @ApiStandardResponse(ItemResDto, HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() dto: CreateItemDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'items:create:attempt'
    req.logMessage = `Usuario ${user.id} está creando un nuevo ítem`

    try {
      const result = await this.service.create(dto, user.id)
      req.action = 'items:create:success'
      req.logMessage = `Ítem creado con ID: ${result.id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'items:create:failed'
      req.logMessage = `Error al crear ítem: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Actualizar un item por id',
  })
  @ApiBody({ type: UpdateItemDto })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
  ) {
    req.action = 'items:update:attempt'
    req.logMessage = `Actualizando ítem con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'items:update:success'
      req.logMessage = `Ítem actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'items:update:failed'
      req.logMessage = `Error al actualizar ítem ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @Auth(USER_TYPE.ADMINISTRATOR)
  @ApiOperation({
    summary: 'Eliminar un item por id',
  })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'items:remove:attempt'
    req.logMessage = `Usuario ${user.id} está eliminando el ítem ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'items:remove:success'
      req.logMessage = `Ítem eliminado ID: ${id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'items:remove:failed'
      req.logMessage = `Error al eliminar ítem ID ${id}: ${error.message}`
      throw error
    }
  }
}
