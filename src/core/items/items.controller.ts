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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateItemDto } from './dto/req/create-item.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ItemResDto } from './dto/res/item-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateItemDto } from './dto/req/update-item.dto'
import { ItemsService } from './items.service'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { UserRole } from 'src/core/auth/types/user-role'
import { GetUser } from 'src/core/auth/decorators/get-user.decorator'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'

@ApiTags('Items')
@Controller('items')
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  @Auth(
    UserRole.ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.TEACHER,
    UserRole.STUDENT,
  )
  @ApiOperation({
    summary: 'Obtener todos los items',
  })
  @ApiPaginatedResponse(ItemResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @Auth(
    UserRole.ADMINISTRATOR,
    UserRole.MANAGER,
    UserRole.TEACHER,
    UserRole.STUDENT,
  )
  @ApiOperation({
    summary: 'Obtener un item por id',
  })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @Auth(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Crear un nuevo item',
  })
  @ApiBody({ type: CreateItemDto })
  @ApiStandardResponse(ItemResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateItemDto, @GetUser() user: SimpleUserResDto) {
    return this.service.create(dto, user.id)
  }

  @Patch(':id')
  @Auth(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @ApiOperation({
    summary: 'Actualizar un item por id',
  })
  @ApiBody({ type: UpdateItemDto })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @Auth(UserRole.ADMINISTRATOR)
  @ApiOperation({
    summary: 'Eliminar un item por id',
  })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
