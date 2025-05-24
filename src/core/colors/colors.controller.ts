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
import { ColorsService } from './colors.service'
import { CreateColorDto } from './dto/req/create-color.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ColorResDto } from './dto/res/color-res.dto'
import { UpdateColorDto } from './dto/req/update-color.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterColorDto } from './dto/req/color-filter.dto'

@ApiTags('Colors')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('colors')
export class ColorsController {
  constructor(private readonly service: ColorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los colores',
  })
  @ApiPaginatedResponse(ColorResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterColorDto) {
    req.action = 'colors:find-all:attempt'
    req.logMessage = 'Obteniendo lista de colores'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'colors:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} colores`
      return result
    } catch (error) {
      req.action = 'colors:find-all:failed'
      req.logMessage = `Error al obtener colores: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un color por id',
  })
  @ApiStandardResponse(ColorResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'colors:find-one:attempt'
    req.logMessage = `Buscando color con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'colors:find-one:success'
      req.logMessage = `Color encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'colors:find-one:failed'
      req.logMessage = `Error al buscar color ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo color',
  })
  @ApiBody({ type: CreateColorDto })
  @ApiStandardResponse(ColorResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateColorDto) {
    req.action = 'colors:create:attempt'
    req.logMessage = `Creando nuevo color: ${dto.name}`

    try {
      const result = await this.service.create(dto)
      req.action = 'colors:create:success'
      req.logMessage = `Color creado con ID: ${result.id} - Nombre: ${dto.name}`
      return result
    } catch (error) {
      req.action = 'colors:create:failed'
      req.logMessage = `Error al crear color: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un color por id',
  })
  @ApiBody({ type: UpdateColorDto })
  @ApiStandardResponse(ColorResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateColorDto,
  ) {
    req.action = 'colors:update:attempt'
    req.logMessage = `Actualizando color con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'colors:update:success'
      req.logMessage = `Color actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'colors:update:failed'
      req.logMessage = `Error al actualizar color ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un color por id',
  })
  @ApiStandardResponse(ColorResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'colors:remove:attempt'
    req.logMessage = `Eliminando color con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'colors:remove:success'
      req.logMessage = `Color eliminado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'colors:remove:failed'
      req.logMessage = `Error al eliminar color ID ${id}: ${error.message}`
      throw error
    }
  }
}
