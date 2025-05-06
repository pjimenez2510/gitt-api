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
import { AssetsValueService } from './assets-value.service'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { AssetValueResDto } from './dto/res/asset-value-res.dto'
import { CreateAssetValueDto } from './dto/req/create-asset-value.dto'
import { UpdateAssetValueDto } from './dto/req/update-asset-value.dto'

@ApiTags('Assets-Value')
@Controller('assets-value')
export class AssetsValueController {
  constructor(private readonly service: AssetsValueService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all Assets Value',
  })
  @ApiPaginatedResponse(AssetValueResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a asset by Itemid',
  })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByItemId(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new asset value',
  })
  @ApiBody({ type: CreateAssetValueDto })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateAssetValueDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a asset value by itemid',
  })
  @ApiBody({ type: UpdateAssetValueDto })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssetValueDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category by itemId',
  })
  @ApiStandardResponse(AssetValueResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
