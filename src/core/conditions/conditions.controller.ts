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
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/req/create-condition.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ConditionResDto } from './dto/res/condition-res.dto'
import { UpdateConditionDto } from './dto/req/update-condition.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterConditionDto } from './dto/req/condition-filter.dto'

@ApiTags('Conditions')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('conditions')
export class ConditionsController {
  constructor(private readonly service: ConditionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las condiciones',
  })
  @ApiPaginatedResponse(ConditionResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterConditionDto) {
    req.action = 'conditions:find-all:attempt'
    req.logMessage = 'Obteniendo lista de condiciones'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'conditions:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} condiciones`
      return result
    } catch (error) {
      req.action = 'conditions:find-all:failed'
      req.logMessage = `Error al obtener condiciones: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una condición por id',
  })
  @ApiStandardResponse(ConditionResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'conditions:find-one:attempt'
    req.logMessage = `Buscando condición con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'conditions:find-one:success'
      req.logMessage = `Condición encontrada ID: ${id}`
      return result
    } catch (error) {
      req.action = 'conditions:find-one:failed'
      req.logMessage = `Error al buscar condición ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva condición',
  })
  @ApiBody({ type: CreateConditionDto })
  @ApiStandardResponse(ConditionResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateConditionDto) {
    req.action = 'conditions:create:attempt'
    req.logMessage = 'Creando nueva condición'

    try {
      const result = await this.service.create(dto)
      req.action = 'conditions:create:success'
      req.logMessage = `Condición creada con ID: ${result.id}`
      return result
    } catch (error) {
      req.action = 'conditions:create:failed'
      req.logMessage = `Error al crear condición: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una condición por id',
  })
  @ApiBody({ type: UpdateConditionDto })
  @ApiStandardResponse(ConditionResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConditionDto,
  ) {
    req.action = 'conditions:update:attempt'
    req.logMessage = `Actualizando condición con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'conditions:update:success'
      req.logMessage = `Condición actualizada ID: ${id}`
      return result
    } catch (error) {
      req.action = 'conditions:update:failed'
      req.logMessage = `Error al actualizar condición ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una condición por id',
  })
  @ApiStandardResponse(ConditionResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'conditions:remove:attempt'
    req.logMessage = `Eliminando condición con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'conditions:remove:success'
      req.logMessage = `Condición eliminada ID: ${id}`
      return result
    } catch (error) {
      req.action = 'conditions:remove:failed'
      req.logMessage = `Error al eliminar condición ID ${id}: ${error.message}`
      throw error
    }
  }
}
