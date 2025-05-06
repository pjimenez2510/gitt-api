import { Controller } from '@nestjs/common'
import { UsersService } from './users.service'

import { ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'Create a new user',
  // })
  // @ApiBody({ type: CreateUserDto })
  // @ApiStandardResponse(UserResDto, HttpStatus.CREATED)
  // create(@Body() dto: CreateUserDto) {
  //   return this.service.create(dto)
  // }

  // @Get()
  // @ApiOperation({
  //   summary: 'Get all users',
  // })
  // @ApiPaginatedResponse(UserResDto, HttpStatus.OK)
  // findAll(@Query() paginationDto: BaseParamsDto) {
  //   return this.service.findAll(paginationDto)
  // }

  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Get a user by id',
  // })
  // @ApiStandardResponse(UserResDto, HttpStatus.OK)
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.findOne(id)
  // }

  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'Update a user by id',
  // })
  // @ApiBody({ type: UpdateUserDto })
  // @ApiStandardResponse(UserResDto, HttpStatus.OK)
  // update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
  //   return this.service.update(id, dto)
  // }

  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'Delete a user by id',
  // })
  // @ApiStandardResponse(UserResDto, HttpStatus.OK)
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.remove(id)
  // }
}
