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
import { LocationsService } from './locations.service'
import { CreateLocationDto } from './dto/req/create-location.dto'
import { UpdateLocationDto } from './dto/req/update-location.dto'
import { LocationResDto } from './dto/res/location-res.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterLocationDto } from './dto/req/filter-location.dto'

@ApiTags('Locations')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las ubicaciones',
  })
  @ApiPaginatedResponse(LocationResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterLocationDto) {
    req.action = 'locations:find-all:attempt'
    req.logMessage = 'Obteniendo todas las ubicaciones'
    try {
      const result = await this.locationsService.findAll(filterDto)
      req.action = 'locations:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} ubicaciones correctamente`
      return result
    } catch (error) {
      req.action = 'locations:find-all:failed'
      req.logMessage = `Error al obtener las ubicaciones: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una ubicación por ID',
  })
  @ApiStandardResponse(LocationResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'locations:find-one:attempt'
    req.logMessage = `Buscando ubicación con ID: ${id}`

    try {
      const result = await this.locationsService.findOne(id)
      req.action = 'locations:find-one:success'
      req.logMessage = `Ubicación con ID: ${id} obtenida correctamente`
      return result
    } catch (error) {
      req.action = 'locations:find-one:failed'
      req.logMessage = `Error al obtener la ubicación con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva ubicación',
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiStandardResponse(LocationResDto, HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    req.action = 'locations:create:attempt'
    req.logMessage = 'Creando una nueva ubicación'

    try {
      const result = await this.locationsService.create(createLocationDto)
      req.action = 'locations:create:success'
      req.logMessage = `Ubicación creada correctamente con ID: ${result.id}`
      return result
    } catch (error) {
      req.action = 'locations:create:failed'
      req.logMessage = `Error al crear la ubicación: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una ubicación por ID',
  })
  @ApiBody({ type: UpdateLocationDto })
  @ApiStandardResponse(LocationResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    req.action = 'locations:update:attempt'
    req.logMessage = `Actualizando ubicación con ID: ${id}`

    try {
      const result = await this.locationsService.update(id, updateLocationDto)
      req.action = 'locations:update:success'
      req.logMessage = `Ubicación con ID: ${id} actualizada correctamente`
      return result
    } catch (error) {
      req.action = 'locations:update:failed'
      req.logMessage = `Error al actualizar la ubicación con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una ubicación por ID',
  })
  @ApiStandardResponse(LocationResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'locations:remove:attempt'
    req.logMessage = `Eliminando ubicación con ID: ${id}`

    try {
      const result = await this.locationsService.remove(id)
      req.action = 'locations:remove:success'
      req.logMessage = `Ubicación con ID: ${id} eliminada correctamente`
      return result
    } catch (error) {
      req.action = 'locations:remove:failed'
      req.logMessage = `Error al eliminar la ubicación con ID ${id}: ${error.message}`
      throw error
    }
  }
}
