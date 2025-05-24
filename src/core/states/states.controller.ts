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
import { StatesService } from './states.service'
import { CreateStateDto } from './dto/req/create-state.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { StateResDto } from './dto/res/state-res.dto'
import { UpdateStateDto } from './dto/req/update-state.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterStateDto } from './dto/req/filter-state.dto'

@ApiTags('States')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('states')
export class StatesController {
  constructor(private readonly service: StatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los estados',
  })
  @ApiPaginatedResponse(StateResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterStateDto) {
    req.action = 'states:find-all:attempt'
    req.logMessage = 'Obteniendo todos los estados'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'states:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} estados correctamente`
      return result
    } catch (error) {
      req.action = 'states:find-all:failed'
      req.logMessage = `Error al obtener los estados: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un estado por id',
  })
  @ApiStandardResponse(StateResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'states:find-one:attempt'
    req.logMessage = `Buscando estado con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'states:find-one:success'
      req.logMessage = `Estado con ID: ${id} obtenido correctamente`
      return result
    } catch (error) {
      req.action = 'states:find-one:failed'
      req.logMessage = `Error al obtener el estado con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo estado',
  })
  @ApiBody({ type: CreateStateDto })
  @ApiStandardResponse(StateResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateStateDto) {
    req.action = 'states:create:attempt'
    req.logMessage = 'Creando un nuevo estado'

    try {
      const result = await this.service.create(dto)
      req.action = 'states:create:success'
      req.logMessage = `Estado creado correctamente con ID: ${result.id}`
      return result
    } catch (error) {
      req.action = 'states:create:failed'
      req.logMessage = `Error al crear el estado: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un estado por id',
  })
  @ApiBody({ type: UpdateStateDto })
  @ApiStandardResponse(StateResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStateDto,
  ) {
    req.action = 'states:update:attempt'
    req.logMessage = `Actualizando estado con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'states:update:success'
      req.logMessage = `Estado con ID: ${id} actualizado correctamente`
      return result
    } catch (error) {
      req.action = 'states:update:failed'
      req.logMessage = `Error al actualizar el estado con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un estado por id',
  })
  @ApiStandardResponse(StateResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'states:remove:attempt'
    req.logMessage = `Eliminando estado con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'states:remove:success'
      req.logMessage = `Estado con ID: ${id} eliminado correctamente`
      return result
    } catch (error) {
      req.action = 'states:remove:failed'
      req.logMessage = `Error al eliminar el estado con ID ${id}: ${error.message}`
      throw error
    }
  }
}
