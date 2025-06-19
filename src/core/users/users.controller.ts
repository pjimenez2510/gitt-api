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
} from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from './users.service'

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/req/create-user.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { UserResDto } from './dto/res/user-res.dto'
import { UpdateUserDto } from './dto/req/update-user.dto'
import { ChangeUserStatusDto } from './dto/req/change-user-status.dto'
import { UserFiltersDto } from './dto/req/user-filters.dto'

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
  })
  @ApiStandardResponse()
  async create(@Req() req: Request, @Body() dto: CreateUserDto) {
    req.action = 'users:create:attempt'
    req.logMessage = `Creando un nuevo usuario con nombre de usuario: ${dto.userName}`

    try {
      const result = await this.service.create(dto)
      req.action = 'users:create:success'
      req.logMessage = `Usuario creado correctamente con nombre de usuario: ${dto.userName}`
      return result
    } catch (error) {
      req.action = 'users:create:failed'
      req.logMessage = `Error al crear el usuario: ${error.message}`
      throw error
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
  })
  @ApiPaginatedResponse(UserResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: UserFiltersDto) {
    req.action = 'users:find-all:attempt'
    req.logMessage = 'Obteniendo todos los usuarios'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'users:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} usuarios correctamente`
      return result
    } catch (error) {
      req.action = 'users:find-all:failed'
      req.logMessage = `Error al obtener los usuarios: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
  })
  @ApiStandardResponse(UserResDto, HttpStatus.OK)
  async findById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'users:find-by-id:attempt'
    req.logMessage = `Buscando usuario con ID: ${id}`

    try {
      const result = await this.service.findById(id)
      req.action = 'users:find-by-id:success'
      req.logMessage = `Usuario con ID: ${id} obtenido correctamente`
      return result
    } catch (error) {
      req.action = 'users:find-by-id:failed'
      req.logMessage = `Error al obtener el usuario con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario por ID',
  })
  @ApiStandardResponse(UserResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    req.action = 'users:update:attempt'
    req.logMessage = `Actualizando usuario con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'users:update:success'
      req.logMessage = `Usuario con ID: ${id} actualizado correctamente`
      return result
    } catch (error) {
      req.action = 'users:update:failed'
      req.logMessage = `Error al actualizar el usuario con ID ${id}: ${error.message}`
      throw error
    }
  }

  @Patch('change-status/:id')
  @ApiOperation({
    summary: 'Cambiar el estado de un usuario por ID',
  })
  async changeStatus(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeUserStatusDto,
  ) {
    req.action = 'users:change-status:attempt'
    req.logMessage = `Cambiando estado del usuario con ID: ${id} a ${dto.status}`

    try {
      const result = await this.service.changeStatus(id, dto.status)
      req.action = 'users:change-status:success'
      req.logMessage = `Estado del usuario con ID: ${id} cambiado correctamente a ${dto.status}`
      return result
    } catch (error) {
      req.action = 'users:change-status:failed'
      req.logMessage = `Error al cambiar el estado del usuario con ID ${id}: ${error.message}`
      throw error
    }
  }
}
