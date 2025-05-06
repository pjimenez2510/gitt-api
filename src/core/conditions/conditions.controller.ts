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
import { ConditionsService } from './conditions.service'
import { CreateConditionDto } from './dto/req/create-condition.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { ConditionResDto } from './dto/res/condition-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UpdateConditionDto } from './dto/req/update-condition.dto'

@ApiTags('Conditions')
@Controller('conditions')
export class ConditionsController {
  constructor(private readonly service: ConditionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las condiciones',
  })
  @ApiPaginatedResponse(ConditionResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una condición por id',
  })
  @ApiStandardResponse(ConditionResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva condición',
  })
  @ApiBody({ type: CreateConditionDto })
  @ApiStandardResponse(ConditionResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateConditionDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una condición por id',
  })
  @ApiBody({ type: UpdateConditionDto })
  @ApiStandardResponse(ConditionResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConditionDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una condición por id',
  })
  @ApiStandardResponse(ConditionResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
