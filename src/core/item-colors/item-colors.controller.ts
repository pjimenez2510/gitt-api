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
import { ItemColorsService } from './item-colors.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { ItemColorResDto } from './dto/res/item-color-res.dto'
import { CreateItemColorDto } from './dto/req/create-item-color.dto'
import { UpdateItemColorDto } from './dto/req/update-item-color.dto'

@ApiTags('Item Colors')
@Controller('item-colors')
export class ItemColorsController {
  constructor(private readonly service: ItemColorsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener todos los colores de un ítem',
  })
  @ApiPaginatedResponse(ItemColorResDto, HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) itemId: number,
    @Query() paginationDto: BaseParamsDto,
  ) {
    return this.service.findByItemId(paginationDto, itemId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un detalle color de ítem por id',
  })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de ítem',
  })
  @ApiBody({ type: CreateItemColorDto })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateItemColorDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de ítem por id',
  })
  @ApiBody({ type: UpdateItemColorDto })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemColorDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de ítem por id',
  })
  @ApiStandardResponse(ItemColorResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
