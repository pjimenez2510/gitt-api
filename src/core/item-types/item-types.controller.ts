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
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ItemTypesService } from './item-types.service'
import { CreateItemTypeDto } from './dto/req/create-item-type.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemTypeResDto } from './dto/res/item-type-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateItemTypeDto } from './dto/req/update-item-type.dto'

@ApiTags('Item Types')
@Controller('item-types')
export class ItemTypesController {
  constructor(private readonly service: ItemTypesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de ítems',
  })
  @ApiPaginatedResponse(ItemTypeResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de ítem por id',
  })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de ítem',
  })
  @ApiBody({ type: CreateItemTypeDto })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateItemTypeDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de ítem por id',
  })
  @ApiBody({ type: UpdateItemTypeDto })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemTypeDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de ítem por id',
  })
  @ApiStandardResponse(ItemTypeResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
