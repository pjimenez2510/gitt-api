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
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CertificatesService } from './certificates.service'
import { CreateCertificateDto } from './dto/req/create-certificate.dto'
import { UpdateCertificateDto } from './dto/req/update-certificate.dto'
import { CertificateResDto } from './dto/res/certificate-res.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_TYPE } from '../users/types/user-type.enum'
import { FilterCertificateDto } from './dto/req/certificate-filter.dto'

@ApiTags('Certificates')
@ApiBearerAuth()
@Auth(USER_TYPE.ADMINISTRATOR)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los certificados',
  })
  @ApiPaginatedResponse(CertificateResDto, HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filterDto: FilterCertificateDto) {
    req.action = 'certificates:find-all:attempt'
    req.logMessage = 'Obteniendo lista de certificados'

    try {
      const result = await this.service.findAll(filterDto)
      req.action = 'certificates:find-all:success'
      req.logMessage = `Se obtuvieron ${result.records.length} certificados`
      return result
    } catch (error) {
      req.action = 'certificates:find-all:failed'
      req.logMessage = `Error al obtener certificados: ${error.message}`
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un certificado por ID',
  })
  @ApiStandardResponse(CertificateResDto, HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'certificates:find-one:attempt'
    req.logMessage = `Buscando certificado con ID: ${id}`

    try {
      const result = await this.service.findOne(id)
      req.action = 'certificates:find-one:success'
      req.logMessage = `Certificado encontrado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'certificates:find-one:failed'
      req.logMessage = `Error al buscar certificado ID ${id}: ${error.message}`
      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo certificado',
  })
  @ApiBody({ type: CreateCertificateDto })
  @ApiStandardResponse(CertificateResDto, HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateCertificateDto) {
    req.action = 'certificates:create:attempt'
    req.logMessage = 'Creando nuevo certificado'

    try {
      const result = await this.service.create(dto)
      req.action = 'certificates:create:success'
      req.logMessage = `Certificado creado con ID: ${result.id}`
      return result
    } catch (error) {
      req.action = 'certificates:create:failed'
      req.logMessage = `Error al crear certificado: ${error.message}`
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un certificado por ID',
  })
  @ApiBody({ type: UpdateCertificateDto })
  @ApiStandardResponse(CertificateResDto, HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateDto,
  ) {
    req.action = 'certificates:update:attempt'
    req.logMessage = `Actualizando certificado con ID: ${id}`

    try {
      const result = await this.service.update(id, dto)
      req.action = 'certificates:update:success'
      req.logMessage = `Certificado actualizado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'certificates:update:failed'
      req.logMessage = `Error al actualizar certificado ID ${id}: ${error.message}`
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un certificado por ID',
  })
  @ApiStandardResponse(CertificateResDto, HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    req.action = 'certificates:remove:attempt'
    req.logMessage = `Eliminando certificado con ID: ${id}`

    try {
      const result = await this.service.remove(id)
      req.action = 'certificates:remove:success'
      req.logMessage = `Certificado eliminado ID: ${id}`
      return result
    } catch (error) {
      req.action = 'certificates:remove:failed'
      req.logMessage = `Error al eliminar certificado ID ${id}: ${error.message}`
      throw error
    }
  }
}
