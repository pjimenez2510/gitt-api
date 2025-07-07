import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  BadRequestException,
} from '@nestjs/common'
import { Request } from 'express'
import { PeopleService } from './people.service'

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreatePersonDto } from './dto/req/create-person.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { PersonResDto } from './dto/res/person-res.dto'
import { UpdatePersonDto } from './dto/req/update-person.dto'
import { ChangePersonStatusDto } from './dto/req/change-person-status.dto'
import { PersonFiltersDto } from './dto/req/person-filters.dto'
import { MarkAsDefaulterDto } from './dto/req/mark-as-defaulter.dto'
import { RemoveDefaulterStatusDto } from './dto/req/remove-defaulter-status.dto'

@ApiTags('People')
@Controller('people')
@ApiBearerAuth()
export class PeopleController {
  constructor(private readonly service: PeopleService) { }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva persona',
  })
  @ApiStandardResponse()
  async create(@Req() req: Request, @Body() dto: CreatePersonDto) {
    req.action = 'people:create:attempt'
    req.logMessage = `Creando una nueva persona con DNI: ${dto.dni}`

    try {
      const result = await this.service.create(dto)
      req.action = 'people:create:success'
      req.logMessage = `Persona creada correctamente con DNI: ${dto.dni}`
      return result
    } catch (error) {
      req.action = 'people:create:failed'
      req.logMessage = `Error al crear la persona: ${error.message}`
      throw error
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las personas',
  })
  @ApiPaginatedResponse(PersonResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: PersonFiltersDto) {
    req.action = 'people:find-all:attempt'
    req.logMessage = 'Obteniendo todas las personas'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'people:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} personas correctamente`
      return result
    } catch (error) {
      req.action = 'people:find-all:failed'
      req.logMessage = `Error al obtener las personas: ${error.message}`
      throw error
    }
  }

  @Get('find-or-create/:dni')
  @ApiOperation({
    summary: 'Buscar persona por DNI o crearla desde base externa si no existe',
  })
  @ApiStandardResponse(PersonResDto, HttpStatus.OK)
  async findOrCreateByDni(@Req() req: Request, @Param('dni') dni: string) {
    req.action = 'people:find-or-create:attempt'
    req.logMessage = `Buscando o creando persona con DNI: ${dni}`

    try {
      const result = await this.service.findOrCreatePersonByDni(dni)
      req.action = 'people:find-or-create:success'
      req.logMessage = `Persona con DNI: ${dni} obtenida/creada correctamente`
      return result
    } catch (error) {
      req.action = 'people:find-or-create:failed'
      req.logMessage = `Error al buscar/crear persona con DNI ${dni}: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una persona por ID',
  })
  @ApiStandardResponse(PersonResDto, HttpStatus.OK)
  async findById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'people:find-by-id:attempt'
    req.logMessage = `Buscando persona con ID: ${id}`

    try {
      const result = await this.service.findById(id)
      req.action = 'people:find-by-id:success'
      req.logMessage = `Persona con ID: ${id} obtenida correctamente`
      return result
    } catch (error) {
      req.action = 'people:find-by-id:failed'
      req.logMessage = `Error al obtener la persona con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una persona por ID',
  })
  @ApiStandardResponse(PersonResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto,
  ) {
    req.action = 'people:update:attempt'
    req.logMessage = `Actualizando persona con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'people:update:success'
      req.logMessage = `Persona con ID: ${id} actualizada correctamente`
      return result
    } catch (error) {
      req.action = 'people:update:failed'
      req.logMessage = `Error al actualizar la persona con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Patch('change-status/:id')
  @ApiOperation({
    summary: 'Cambiar el estado de una persona por ID',
  })
  async changeStatus(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePersonStatusDto,
  ) {
    const { status } = dto
    req.action = 'people:change-status:attempt'
    req.logMessage = `Cambiando estado de la persona con ID: ${id} a ${status}`

    try {
      const result = await this.service.changeStatus(id, status)
      req.action = 'people:change-status:success'
      req.logMessage = `Estado de la persona con ID: ${id} cambiado correctamente a ${status}`
      return result
    } catch (error) {
      req.action = 'people:change-status:failed'
      req.logMessage = `Error al cambiar el estado de la persona con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post('mark-as-defaulter')
  @ApiOperation({
    summary: 'Marcar a una persona como morosa por ID o DNI',
  })
  @ApiStandardResponse(PersonResDto, HttpStatus.OK)
  async markAsDefaulter(
    @Req() req: Request,
    @Body() dto: MarkAsDefaulterDto,
  ) {
    const { personId, dni } = dto
    const identifier = personId || dni

    if (!identifier) {
      throw new BadRequestException('Debe proporcionar un ID de persona o DNI')
    }

    req.action = 'people:mark-as-defaulter:attempt'
    req.logMessage = `Marcando como morosa a la persona con identificador: ${identifier}`

    try {
      const result = await this.service.markAsDefaulter(identifier)
      req.action = 'people:mark-as-defaulter:success'
      req.logMessage = `Persona con identificador: ${identifier} marcada como morosa correctamente`
      return result
    } catch (error) {
      req.action = 'people:mark-as-defaulter:failed'
      req.logMessage = `Error al marcar como morosa a la persona con identificador ${identifier}: ${error.message}`
      throw error
    }
  }

  @Post('remove-defaulter-status')
  @ApiOperation({
    summary: 'Quitar el estado moroso de una persona por ID o DNI',
  })
  @ApiStandardResponse(PersonResDto, HttpStatus.OK)
  async removeDefaulterStatus(
    @Req() req: Request,
    @Body() dto: RemoveDefaulterStatusDto,
  ) {
    const { personId, dni } = dto
    const identifier = personId || dni

    if (!identifier) {
      throw new BadRequestException('Debe proporcionar un ID de persona o DNI')
    }

    req.action = 'people:remove-defaulter-status:attempt'
    req.logMessage = `Quitando estado moroso de la persona con identificador: ${identifier}`

    try {
      const result = await this.service.removeDefaulterStatus(identifier)
      req.action = 'people:remove-defaulter-status:success'
      req.logMessage = `Estado moroso quitado correctamente de la persona con identificador: ${identifier}`
      return result
    } catch (error) {
      req.action = 'people:remove-defaulter-status:failed'
      req.logMessage = `Error al quitar el estado moroso de la persona con identificador ${identifier}: ${error.message}`
      throw error
    }
  }
}
