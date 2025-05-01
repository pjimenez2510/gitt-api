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
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/req/create-category.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CategoryResDto } from './dto/res/category-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateCategoryDto } from './dto/req/update-category.dto'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiPaginatedResponse(CategoryResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by id',
  })
  @ApiStandardResponse(CategoryResDto, HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiStandardResponse(CategoryResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a category by id',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiStandardResponse(CategoryResDto, HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category by id',
  })
  @ApiStandardResponse(CategoryResDto, HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id)
  }
}
