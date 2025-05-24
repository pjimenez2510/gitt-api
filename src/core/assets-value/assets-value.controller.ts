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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AssetsValueService } from './assets-value.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { AssetValueResDto } from './dto/res/asset-value-res.dto'
import { CreateAssetValueDto } from './dto/req/create-asset-value.dto'
import { UpdateAssetValueDto } from './dto/req/update-asset-value.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'

@ApiTags('Assets-Value')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('assets-value')
export class AssetsValueController {
  constructor(private readonly service: AssetsValueService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los valores de activos',
  })
  @ApiPaginatedResponse(AssetValueResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() paginationDto: BaseParamsDto) {
    req.action = 'assets-value:find-all:attempt'
    req.logMessage = 'Obteniendo lista de valores de activos'

    try {
      const result = await this.service.findAll(paginationDto)
      req.action = 'assets-value:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} valores de activos`
      return result
    } catch (error) {
      req.action = 'assets-value:find-all:failed'
      req.logMessage = `Error al obtener valores de activos: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un valor de activo por ID de ítem',
  })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'assets-value:find-one:attempt'
    req.logMessage = `Buscando valor de activo con ID: ${id}`

    try {
      const result = await this.service.findByItemId(id)
      req.action = 'assets-value:find-one:success'
      req.logMessage = `Valor de activo encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'assets-value:find-one:failed'
      req.logMessage = `Error al buscar valor de activo ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo valor de activo',
  })
  @ApiBody({ type: CreateAssetValueDto })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateAssetValueDto) {
    req.action = 'assets-value:create:attempt'
    req.logMessage = `Creando nuevo valor de activo para item ID: ${dto.itemId}`

    try {
      const result = await this.service.create(dto)
      req.action = 'assets-value:create:success'
      req.logMessage = `Valor de activo creado con ID: ${result.id} para item ID: ${dto.itemId}`
      return result
    } catch (error) {
      req.action = 'assets-value:create:failed'
      req.logMessage = `Error al crear valor de activo para item ID ${dto.itemId}: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un valor de activo por ID de ítem',
  })
  @ApiBody({ type: UpdateAssetValueDto })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssetValueDto,
  ) {
    req.action = 'assets-value:update:attempt'
    req.logMessage = `Actualizando valor de activo con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'assets-value:update:success'
      req.logMessage = `Valor de activo actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'assets-value:update:failed'
      req.logMessage = `Error al actualizar valor de activo ID ${id}: ${error.message}`
      throw error
    }
  }

  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'Delete a category by itemId',
  // })
  // @ApiStandardResponse(AssetValueResDto, HttpStatus.OK)
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.remove(id)
  // }
}
