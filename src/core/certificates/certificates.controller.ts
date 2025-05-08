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
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CertificatesService } from './certificates.service'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { CreateCertificateDto } from './dto/req/create-certificate.dto'
import { UpdateCertificateDto } from './dto/req/update-certificate.dto'
import { CertificateResDto } from './dto/res/certificate-res.dto'

@ApiTags('Certificates')
@ApiBearerAuth()
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all certificates',
  })
  @ApiPaginatedResponse(CertificateResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a certificate by id',
  })
  @ApiStandardResponse(CertificateResDto, HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new certificate',
  })
  @ApiBody({ type: CreateCertificateDto })
  @ApiStandardResponse(CertificateResDto, HttpStatus.CREATED)
  create(@Body() dto: CreateCertificateDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a certificate by id',
  })
  @ApiBody({ type: UpdateCertificateDto })
  @ApiStandardResponse(CertificateResDto, HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a certificate by id',
  })
  @ApiStandardResponse(CertificateResDto, HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
