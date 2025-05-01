import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { WarehousesService } from './warehouses.service'
import { CreateWarehouseDto } from './dto/req/create-warehouse.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { WarehouseResDto } from './dto/res/warehouse-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateWarehouseDto } from './dto/req/update-warehouse.dto'

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los almacenes',
  })
  @ApiPaginatedResponse(WarehouseResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un almacén por id',
  })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo almacén',
  })
  @ApiBody({ type: CreateWarehouseDto })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateWarehouseDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un almacén por id',
  })
  @ApiBody({ type: UpdateWarehouseDto })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWarehouseDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un almacén por id',
  })
  @ApiStandardResponse(WarehouseResDto, HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id)
  }
}
