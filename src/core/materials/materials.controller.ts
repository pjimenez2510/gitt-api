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
import { MaterialsService } from './materials.service'
import { CreateMaterialDto } from './dto/req/create-material.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { MaterialResDto } from './dto/res/material-res.dto'
import { UpdateMaterialDto } from './dto/req/update-material.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterMaterialDto } from './dto/req/filter-material.dto'

@ApiTags('Materials')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly service: MaterialsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los materiales',
  })
  @ApiPaginatedResponse(MaterialResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterMaterialDto) {
    req.action = 'materials:find-all:attempt'
    req.logMessage = 'Obteniendo todos los materiales'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'materials:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} materiales correctamente`
      return result
    } catch (error) {
      req.action = 'materials:find-all:failed'
      req.logMessage = `Error al obtener los materiales: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un material por id',
  })
  @ApiStandardResponse(MaterialResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'materials:find-one:attempt'
    req.logMessage = `Buscando material con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'materials:find-one:success'
      req.logMessage = `Material con ID: ${id} obtenido correctamente`
      return result
    } catch (error) {
      req.action = 'materials:find-one:failed'
      req.logMessage = `Error al obtener el material con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo material',
  })
  @ApiBody({ type: CreateMaterialDto })
  @ApiStandardResponse(MaterialResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateMaterialDto) {
    req.action = 'materials:create:attempt'
    req.logMessage = 'Creando un nuevo material'

    try {
      const result = await this.service.create(dto)
      req.action = 'materials:create:success'
      req.logMessage = `Material creado correctamente con ID: ${result.id}`
      return result
    } catch (error) {
      req.action = 'materials:create:failed'
      req.logMessage = `Error al crear el material: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un material por id',
  })
  @ApiBody({ type: UpdateMaterialDto })
  @ApiStandardResponse(MaterialResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialDto,
  ) {
    req.action = 'materials:update:attempt'
    req.logMessage = `Actualizando material con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'materials:update:success'
      req.logMessage = `Material con ID: ${id} actualizado correctamente`
      return result
    } catch (error) {
      req.action = 'materials:update:failed'
      req.logMessage = `Error al actualizar el material con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un material por id',
  })
  @ApiStandardResponse(MaterialResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'materials:remove:attempt'
    req.logMessage = `Eliminando material con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'materials:remove:success'
      req.logMessage = `Material con ID: ${id} eliminado correctamente`
      return result
    } catch (error) {
      req.action = 'materials:remove:failed'
      req.logMessage = `Error al eliminar el material con ID ${id}: ${error.message}`
      throw error
    }
  }
}
