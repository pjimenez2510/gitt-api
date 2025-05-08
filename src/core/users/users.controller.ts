import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'

import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/req/create-user.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { UserResDto } from './dto/res/user-res.dto'
import { UpdateUserDto } from './dto/req/update-user.dto'
import { ChangeUserStatusDto } from './dto/req/change-user-status.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiPaginatedResponse(UserResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  @ApiStandardResponse(UserResDto, HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  @ApiStandardResponse(UserResDto, HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto)
  }

  @Patch('change-status/:id')
  @ApiOperation({
    summary: 'Change the status of a user by id',
  })
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeUserStatusDto,
  ) {
    return this.service.changeStatus(id, dto.status)
  }
}
