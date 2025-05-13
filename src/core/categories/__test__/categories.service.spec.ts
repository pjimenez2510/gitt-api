import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateCategoryDto } from '../dto/req/create-category.dto';
import { UpdateCategoryDto } from '../dto/req/update-category.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let dbService: typeof mockDatabaseService;

  const mockCategory = {
    id: 1,
    code: 'CAT001',
    name: 'Electronics',
    description: 'Category for electronic items',
    parentCategoryId: null,
    standardUsefulLife: 5,
    depreciationPercentage: '10.00',
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    dbService = mockDatabaseService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of categories', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockCategory]) // Respuesta para la primera consulta (registros)
        .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        records: [mockCategory],
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
    it('should return a category when found', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockCategory]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(dbService.db.select).toHaveBeenCalled();
      expect(dbService.db.from).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      dbService.db.execute.mockResolvedValueOnce([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new category', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([]) // No existe una categoría con el mismo código
        .mockResolvedValueOnce([mockCategory]); // Respuesta para la inserción

      const createDto: CreateCategoryDto = {
        code: 'CAT001',
        name: 'Electronics',
        description: 'Category for electronic items',
        parentCategoryId: undefined,
        standardUsefulLife: 5,
        depreciationPercentage: '10.00',
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockCategory);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(dbService.db.values).toHaveBeenCalledWith({
        code: createDto.code,
        name: createDto.name,
        description: createDto.description,
        parentCategoryId: createDto.parentCategoryId,
        standardUsefulLife: createDto.standardUsefulLife,
        depreciationPercentage: createDto.depreciationPercentage,
      });
    });

    it('should throw DisplayableException if category code already exists', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockCategory]); // Ya existe una categoría con el mismo código

      const createDto: CreateCategoryDto = {
        code: 'CAT001',
        name: 'Electronics',
        description: 'Category for electronic items',
        parentCategoryId: undefined,
        standardUsefulLife: 5,
        depreciationPercentage: '10.00',
      };

      await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
    });
  });

  describe('update', () => {
    it('should update and return a category', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockCategory]) // La categoría existe
        .mockResolvedValueOnce([{ ...mockCategory, name: 'Updated Electronics' }]); // Respuesta para la actualización

      const updateDto: UpdateCategoryDto = {
        name: 'Updated Electronics',
        description: 'Updated description',
      };

      const result = await service.update(1, updateDto);

      expect(result).toEqual({ ...mockCategory, name: 'Updated Electronics' });
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // La categoría no existe

      const updateDto: UpdateCategoryDto = {
        name: 'Updated Electronics',
        description: 'Updated description',
      };

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return a category', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockCategory]) // La categoría existe
        .mockResolvedValueOnce([{ ...mockCategory, active: false }]); // Respuesta para la eliminación

      const result = await service.remove(1);

      expect(result).toEqual({ ...mockCategory, active: false });
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith({ active: false, updateDate: expect.any(Date) });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // La categoría no existe

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});