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
import { WarehousesService } from './warehouses.service'
import { CreateWarehouseDto } from './dto/req/create-warehouse.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { WarehouseResDto } from './dto/res/warehouse-res.dto'
import { UpdateWarehouseDto } from './dto/req/update-warehouse.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterWarehouseDto } from './dto/req/filter-warehouse.dto'

@ApiTags('Warehouses')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los almacenes',
  })
  @ApiPaginatedResponse(WarehouseResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterWarehouseDto) {
    req.action = 'warehouses:find-all:attempt'
    req.logMessage = 'Obteniendo todos los almacenes'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'warehouses:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} almacenes correctamente`
      return result
    } catch (error) {
      req.action = 'warehouses:find-all:failed'
      req.logMessage = `Error al obtener los almacenes: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un almacén por id',
  })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'warehouses:find-one:attempt'
    req.logMessage = `Buscando almacén con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'warehouses:find-one:success'
      req.logMessage = `Almacén con ID: ${id} obtenido correctamente`
      return result
    } catch (error) {
      req.action = 'warehouses:find-one:failed'
      req.logMessage = `Error al obtener el almacén con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo almacén',
  })
  @ApiBody({ type: CreateWarehouseDto })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateWarehouseDto) {
    req.action = 'warehouses:create:attempt'
    req.logMessage = 'Creando un nuevo almacén'

    try {
      const result = await this.service.create(dto)
      req.action = 'warehouses:create:success'
      req.logMessage = `Almacén creado correctamente con ID: ${result.id}`
      return result
    } catch (error) {
      req.action = 'warehouses:create:failed'
      req.logMessage = `Error al crear el almacén: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un almacén por id',
  })
  @ApiBody({ type: UpdateWarehouseDto })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWarehouseDto,
  ) {
    req.action = 'warehouses:update:attempt'
    req.logMessage = `Actualizando almacén con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'warehouses:update:success'
      req.logMessage = `Almacén con ID: ${id} actualizado correctamente`
      return result
    } catch (error) {
      req.action = 'warehouses:update:failed'
      req.logMessage = `Error al actualizar el almacén con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un almacén por id',
  })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'warehouses:remove:attempt'
    req.logMessage = `Eliminando almacén con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'warehouses:remove:success'
      req.logMessage = `Almacén con ID: ${id} eliminado correctamente`
      return result
    } catch (error) {
      req.action = 'warehouses:remove:failed'
      req.logMessage = `Error al eliminar el almacén con ID ${id}: ${error.message}`
      throw error
    }
  }
}
