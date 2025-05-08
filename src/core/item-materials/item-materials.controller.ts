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
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ItemMaterialsService } from './item-materials.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemMaterialResDto } from './dto/res/item-material-res.dto'
import { CreateItemMaterialDto } from './dto/req/create-item-material.dto'
import { UpdateItemMaterialDto } from './dto/req/update-item-material.dto'

@ApiTags('Item Materials')
@Controller('item-materials')
export class ItemMaterialsController {
  constructor(private readonly service: ItemMaterialsService) {}

  @Get('item/:id')
  @ApiOperation({
    summary: 'Obtener todos los detalles de materiales de un ítem',
  })
  @ApiPaginatedResponse(ItemMaterialResDto, HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) itemId: number,
    @Query() paginationDto: BaseParamsDto,
  ) {
    return this.service.findByItemId(paginationDto, itemId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un detalle material de ítem por id',
  })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo material para un ítem',
  })
  @ApiBody({ type: CreateItemMaterialDto })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateItemMaterialDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un material de ítem por id',
  })
  @ApiBody({ type: UpdateItemMaterialDto })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemMaterialDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un material de ítem por id',
  })
  @ApiStandardResponse(ItemMaterialResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
