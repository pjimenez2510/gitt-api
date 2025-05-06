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
import { StatesService } from './states.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { StatusResDto } from './dto/res/status-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { CreateStatusDto } from './dto/req/create-status.dto'
import { UpdateStatusDto } from './dto/req/update-status.dto'

@ApiTags('States')
@Controller('states')
export class StatesController {
  constructor(private readonly service: StatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all states',
  })
  @ApiPaginatedResponse(StatusResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a status by id',
  })
  @ApiStandardResponse(StatusResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new status',
  })
  @ApiBody({ type: CreateStatusDto })
  @ApiStandardResponse(StatusResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateStatusDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a status by id',
  })
  @ApiBody({ type: UpdateStatusDto })
  @ApiStandardResponse(StatusResDto, HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a status by id',
  })
  @ApiStandardResponse(StatusResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
