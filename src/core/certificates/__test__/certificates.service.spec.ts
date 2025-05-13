import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from '../certificates.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateCertificateDto } from '../dto/req/create-certificate.dto';
import { UpdateCertificateDto } from '../dto/req/update-certificate.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';

describe('CertificatesService', () => {
  let service: CertificatesService;
  let dbService: typeof mockDatabaseService;

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

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
    dbService = mockDatabaseService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of certificates', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockCertificate]) // Respuesta para la primera consulta (registros)
        .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        records: [mockCertificate],
        total: 1,
        limit: 10,
        page: 1,
        pages: 1,
      });
      expect(dbService.db.select).toHaveBeenCalled();
      expect(dbService.db.from).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a certificate when found', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockCertificate]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCertificate);
      expect(dbService.db.select).toHaveBeenCalled();
      expect(dbService.db.from).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalled();
    });

    it('should throw NotFoundException when certificate not found', async () => {
      dbService.db.execute.mockResolvedValueOnce([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new certificate', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([]) // No existe un certificado con el mismo número
        .mockResolvedValueOnce([mockCertificate]); // Respuesta para la inserción

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

      const result = await service.create(createDto);

      expect(result).toEqual(mockCertificate);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(dbService.db.values).toHaveBeenCalledWith({
        number: createDto.number,
        date: createDto.date,
        type: createDto.type,
        status: createDto.status,
        deliveryResponsibleId: createDto.deliveryResponsibleId,
        receptionResponsibleId: createDto.receptionResponsibleId,
        observations: createDto.observations,
        accounted: createDto.accounted,
      });
    });

    it('should throw DisplayableException if certificate number already exists', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockCertificate]); // Ya existe un certificado con el mismo número

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

      await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
    });
  });

  describe('update', () => {
    it('should update and return a certificate', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockCertificate]) // El certificado existe
        .mockResolvedValueOnce([{ ...mockCertificate, status: 'ACTIVE' }]); // Respuesta para la actualización

      const updateDto: UpdateCertificateDto = {
        status: 'ACTIVE',
        observations: 'Updated observation.',
      };

      const result = await service.update(1, updateDto);

      expect(result).toEqual({ ...mockCertificate, status: 'ACTIVE' });
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException if certificate does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El certificado no existe

      const updateDto: UpdateCertificateDto = {
        status: 'ACTIVE',
        observations: 'Updated observation.',
      };

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return a certificate', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockCertificate]) // El certificado existe
        .mockResolvedValueOnce([{ ...mockCertificate, accounted: false }]); // Respuesta para la eliminación

      const result = await service.remove(1);

      expect(result).toEqual({ ...mockCertificate, accounted: false });
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith({ accounted: false, updateDate: expect.any(Date) });
    });

    it('should throw NotFoundException if certificate does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El certificado no existe

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});