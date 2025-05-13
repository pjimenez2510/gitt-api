import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesController } from '../certificates.controller';
import { CertificatesService } from '../certificates.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateCertificateDto } from '../dto/req/create-certificate.dto';
import { UpdateCertificateDto } from '../dto/req/update-certificate.dto';

describe('CertificatesController', () => {
  let controller: CertificatesController;
  let service: jest.Mocked<CertificatesService>;

  const mockCertificate = {
    id: 1,
    number: 12345,
    date: '2023-10-01',
    type: 'TRANSFER',
    status: 'DRAFT',
    deliveryResponsibleId: 1,
    receptionResponsibleId: 2,
    observations: 'This is a sample observation.',
    accounted: false,
  };

  const mockPaginatedResponse = {
    records: [mockCertificate],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockCertificatesService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockCertificate),
      create: jest.fn().mockResolvedValue(mockCertificate),
      update: jest.fn().mockResolvedValue({ ...mockCertificate, status: 'ACTIVE' }),
      remove: jest.fn().mockResolvedValue(mockCertificate),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificatesController],
      providers: [
        {
          provide: CertificatesService,
          useValue: mockCertificatesService,
        },
      ],
    }).compile();

    controller = module.get<CertificatesController>(CertificatesController);
    service = module.get(CertificatesService) as jest.Mocked<CertificatesService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of certificates', async () => {
    const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

    const result = await controller.findAll(paginationDto);

    expect(result).toEqual(mockPaginatedResponse);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('should return a single certificate by id', async () => {
    const certificateId = 1;

    const result = await controller.findOne(certificateId);

    expect(result).toEqual(mockCertificate);
    expect(service.findOne).toHaveBeenCalledWith(certificateId);
  });

  it('should create and return a new certificate', async () => {
    const createDto: CreateCertificateDto = {
      number: 12345,
      date: '2023-10-01',
      type: 'TRANSFER',
      status: 'DRAFT',
      deliveryResponsibleId: 1,
      receptionResponsibleId: 2,
      observations: 'This is a sample observation.',
      accounted: false,
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(mockCertificate);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should update and return a certificate', async () => {
    const certificateId = 1;
    const updateDto: UpdateCertificateDto = {
      status: 'ACTIVE',
      observations: 'Updated observation.',
    };

    const result = await controller.update(certificateId, updateDto);

    expect(result).toEqual({ ...mockCertificate, status: 'ACTIVE' });
    expect(service.update).toHaveBeenCalledWith(certificateId, updateDto);
  });

  it('should remove a certificate and return it', async () => {
    const certificateId = 1;

    const result = await controller.remove(certificateId);

    expect(result).toEqual(mockCertificate);
    expect(service.remove).toHaveBeenCalledWith(certificateId);
  });
});