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
import { MaterialsService } from './materials.service'
import { CreateMaterialDto } from './dto/req/create-material.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { MaterialResDto } from './dto/res/material-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateMaterialDto } from './dto/req/update-material.dto'

@ApiTags('Materials')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly service: MaterialsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los materiales',
  })
  @ApiPaginatedResponse(MaterialResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un material por id',
  })
  @ApiStandardResponse(MaterialResDto, HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo material',
  })
  @ApiBody({ type: CreateMaterialDto })
  @ApiStandardResponse(MaterialResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateMaterialDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un material por id',
  })
  @ApiBody({ type: UpdateMaterialDto })
  @ApiStandardResponse(MaterialResDto, HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMaterialDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un material por id',
  })
  @ApiStandardResponse(MaterialResDto, HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id)
  }
}
