import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  Req,
  ParseIntPipe,
} from '@nestjs/common'
import { NotificationTemplatesService } from './notification-templates.service'
import { CreateNotificationTemplateDto } from './dto/req/create-notification-template.dto'
import { UpdateNotificationTemplateDto } from './dto/req/update-notification-template.dto'
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger'
import { FilterNotificationTemplateDto } from './dto/req/filter-notification-template.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { NotificationTemplateResDto } from './dto/res/notification-template-res.dto'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'
import { Request } from 'express'

@ApiTags('Notification Templates')
@ApiBearerAuth()
@Controller('notification-templates')
export class NotificationTemplatesController {
  constructor(private readonly service: NotificationTemplatesService) {}

  @Post()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Crear una nueva plantilla de notificación',
  })
  @ApiBody({ type: CreateNotificationTemplateDto })
  @ApiStandardResponse(NotificationTemplateResDto, HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() createNotificationTemplateDto: CreateNotificationTemplateDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'notification-templates:create:attempt'
    req.logMessage = `Usuario ${user.id} está creando una nueva plantilla de notificación`

    try {
      const result = await this.service.create(createNotificationTemplateDto)
      req.action = 'notification-templates:create:success'
      req.logMessage = `Plantilla de notificación creada con ID: ${result.id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'notification-templates:create:failed'
      req.logMessage = `Error al crear plantilla de notificación: ${error.message}`
      throw error
    }
  }

  @Get()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener todas las plantillas de notificación con filtros',
  })
  @ApiPaginatedResponse(NotificationTemplateResDto, HttpStatus.OK)
  async findAll(
    @Req() req: Request,
    @Query() filterDto: FilterNotificationTemplateDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'notification-templates:find-all:attempt'
    req.logMessage = `Usuario ${user.id} está obteniendo todas las plantillas de notificación con filtros`

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'notification-templates:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} plantillas de notificación por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'notification-templates:find-all:failed'
      req.logMessage = `Error al obtener plantillas de notificación: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Obtener una plantilla de notificación por ID',
  })
  @ApiStandardResponse(NotificationTemplateResDto, HttpStatus.OK)
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'notification-templates:find-one:attempt'
    req.logMessage = `Usuario ${user.id} está buscando la plantilla de notificación ID: ${id}`

    try {
      const result = await this.service.findOne(+id)
      req.action = 'notification-templates:find-one:success'
      req.logMessage = `Plantilla de notificación encontrada ID: ${id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'notification-templates:find-one:failed'
      req.logMessage = `Error al buscar plantilla de notificación ID ${id}: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Actualizar una plantilla de notificación por ID',
  })
  @ApiBody({ type: UpdateNotificationTemplateDto })
  @ApiStandardResponse(NotificationTemplateResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationTemplateDto: UpdateNotificationTemplateDto,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'notification-templates:update:attempt'
    req.logMessage = `Usuario ${user.id} está actualizando la plantilla de notificación ID: ${id}`

    try {
      const result = await this.service.update(
        +id,
        updateNotificationTemplateDto,
      )
      req.action = 'notification-templates:update:success'
      req.logMessage = `Plantilla de notificación actualizada ID: ${id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'notification-templates:update:failed'
      req.logMessage = `Error al actualizar plantilla de notificación ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @Auth(USER_TYPE.ADMINISTRATOR)
  @ApiOperation({
    summary: 'Eliminar una plantilla de notificación por ID',
  })
  @ApiStandardResponse(NotificationTemplateResDto, HttpStatus.OK)
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: SimpleUserResDto,
  ) {
    req.action = 'notification-templates:remove:attempt'
    req.logMessage = `Usuario ${user.id} está eliminando la plantilla de notificación ID: ${id}`

    try {
      const result = await this.service.remove(+id)
      req.action = 'notification-templates:remove:success'
      req.logMessage = `Plantilla de notificación eliminada ID: ${id} por el usuario ${user.id}`
      return result
    } catch (error) {
      req.action = 'notification-templates:remove:failed'
      req.logMessage = `Error al eliminar plantilla de notificación ID ${id}: ${error.message}`
      throw error
    }
  }
}
