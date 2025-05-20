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
import { UpdateItemDto } from './dto/req/update-item.dto'
import { ItemsService } from './items.service'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { GetUser } from 'src/core/auth/decorators/get-user.decorator'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterItemDto } from './dto/req/filter-item.dto'

@ApiTags('Items')
@Controller('items')
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  @Auth(
    USER_TYPE.ADMINISTRATOR,
    USER_TYPE.MANAGER,
    USER_TYPE.TEACHER,
    USER_TYPE.STUDENT,
  )
  @ApiOperation({
    summary: 'Obtener todos los items',
  })
  @ApiPaginatedResponse(ItemResDto, HttpStatus.OK)
  findAll(@Query() filterDto: FilterItemDto) {
    return this.service.findAll(filterDto)
  }

  @Get(':id')
  @Auth(
    USER_TYPE.ADMINISTRATOR,
    USER_TYPE.MANAGER,
    USER_TYPE.TEACHER,
    USER_TYPE.STUDENT,
  )
  @ApiOperation({
    summary: 'Obtener un item por id',
  })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Crear un nuevo item',
  })
  @ApiBody({ type: CreateItemDto })
  @ApiStandardResponse(ItemResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateItemDto, @GetUser() user: SimpleUserResDto) {
    return this.service.create(dto, user.id)
  }

  @Patch(':id')
  @Auth(USER_TYPE.ADMINISTRATOR, USER_TYPE.MANAGER)
  @ApiOperation({
    summary: 'Actualizar un item por id',
  })
  @ApiBody({ type: UpdateItemDto })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @Auth(USER_TYPE.ADMINISTRATOR)
  @ApiOperation({
    summary: 'Eliminar un item por id',
  })
  @ApiStandardResponse(ItemResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
