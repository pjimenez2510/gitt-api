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
import { ColorsService } from './colors.service'
import { CreateColorDto } from './dto/req/create-color.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ColorResDto } from './dto/res/color-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateColorDto } from './dto/req/update-color.dto'

@ApiTags('Colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly service: ColorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los colores',
  })
  @ApiPaginatedResponse(ColorResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un color por id',
  })
  @ApiStandardResponse(ColorResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo color',
  })
  @ApiBody({ type: CreateColorDto })
  @ApiStandardResponse(ColorResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateColorDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un color por id',
  })
  @ApiBody({ type: UpdateColorDto })
  @ApiStandardResponse(ColorResDto, HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColorDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un color por id',
  })
  @ApiStandardResponse(ColorResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
