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
import { LocationsService } from './locations.service'
import { CreateLocationDto } from './dto/req/create-location.dto'
import { UpdateLocationDto } from './dto/req/update-location.dto'
import { LocationResDto } from './dto/res/location-res.dto'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtain all locations',
  })
  @ApiPaginatedResponse(LocationResDto, HttpStatus.OK)
  findAll(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const params = { limit, page }
    return this.locationsService.findAll(params)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtain a location by id',
  })
  @ApiStandardResponse(LocationResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new location',
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiStandardResponse(LocationResDto, HttpStatus.CREATED)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a location by id',
  })
  @ApiBody({ type: UpdateLocationDto })
  @ApiStandardResponse(LocationResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a location by id',
  })
  @ApiStandardResponse(LocationResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.remove(id)
  }
}
