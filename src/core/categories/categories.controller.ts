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
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/req/create-category.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CategoryResDto } from './dto/res/category-res.dto'
import { UpdateCategoryDto } from './dto/req/update-category.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterCategoryDto } from './dto/req/filter-category.dto'

@ApiTags('Categories')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las categorías',
  })
  @ApiPaginatedResponse(CategoryResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterCategoryDto) {
    req.action = 'categories:find-all:attempt'
    req.logMessage = 'Obteniendo lista de categorías'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'categories:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} categorías`
      return result
    } catch (error) {
      req.action = 'categories:find-all:failed'
      req.logMessage = `Error al obtener categorías: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
  })
  @ApiStandardResponse(CategoryResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'categories:find-one:attempt'
    req.logMessage = `Buscando categoría con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'categories:find-one:success'
      req.logMessage = `Categoría encontrada ID: ${id}`
      return result
    } catch (error) {
      req.action = 'categories:find-one:failed'
      req.logMessage = `Error al buscar categoría ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva categoría',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiStandardResponse(CategoryResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateCategoryDto) {
    req.action = 'categories:create:attempt'
    req.logMessage = `Creando nueva categoría: ${dto.name}`

    try {
      const result = await this.service.create(dto)
      req.action = 'categories:create:success'
      req.logMessage = `Categoría creada con ID: ${result.id} - Nombre: ${dto.name}`
      return result
    } catch (error) {
      req.action = 'categories:create:failed'
      req.logMessage = `Error al crear categoría: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una categoría por ID',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiStandardResponse(CategoryResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    req.action = 'categories:update:attempt'
    req.logMessage = `Actualizando categoría con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'categories:update:success'
      req.logMessage = `Categoría actualizada ID: ${id}`
      return result
    } catch (error) {
      req.action = 'categories:update:failed'
      req.logMessage = `Error al actualizar categoría ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una categoría por ID',
  })
  @ApiStandardResponse(CategoryResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'categories:remove:attempt'
    req.logMessage = `Eliminando categoría con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'categories:remove:success'
      req.logMessage = `Categoría eliminada ID: ${id}`
      return result
    } catch (error) {
      req.action = 'categories:remove:failed'
      req.logMessage = `Error al eliminar categoría ID ${id}: ${error.message}`
      throw error
    }
  }
}
