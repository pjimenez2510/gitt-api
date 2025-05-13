import { Test, TestingModule } from '@nestjs/testing';
import { ItemMaterialsService } from '../item-materials.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateItemMaterialDto } from '../dto/req/create-item-material.dto';
import { UpdateItemMaterialDto } from '../dto/req/update-item-material.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';
import { plainToInstance } from 'class-transformer';
import { ItemMaterialResDto } from '../dto/res/item-material-res.dto';

describe('ItemMaterialsService', () => {
  let service: ItemMaterialsService;
  let dbService: typeof mockDatabaseService;

  const mockItemMaterial = plainToInstance(ItemMaterialResDto, {
    id: 1,
    itemId: 1,
    materialId: 2,
    isMainMaterial: true,
    registrationDate: new Date(),
    updateDate: new Date(),
  });

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemMaterialsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ItemMaterialsService>(ItemMaterialsService);
    dbService = mockDatabaseService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByItemId', () => {
    it('should return a paginated list of item materials for a specific item', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItemMaterial]) // Respuesta para la primera consulta (registros)
        .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

      const result = await service.findByItemId({ page: 1, limit: 10 }, 1);

      expect(result).toEqual({
        records: [mockItemMaterial],
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
    it('should return an item material when found', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockItemMaterial]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockItemMaterial);
      expect(dbService.db.select).toHaveBeenCalled();
      expect(dbService.db.from).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalled();
    });

    it('should throw NotFoundException when item material not found', async () => {
      dbService.db.execute.mockResolvedValueOnce([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new item material', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([]) // No existe una combinación de item y material
        .mockResolvedValueOnce([mockItemMaterial]); // Respuesta para la inserción

      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockItemMaterial);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(dbService.db.values).toHaveBeenCalledWith(createDto);
    });

    it('should throw DisplayableException if item-material combination already exists', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockItemMaterial]); // Ya existe una combinación de item y material

      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      };

      await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
    });
  });

  describe('update', () => {
    it('should update and return an item material', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItemMaterial]) // El item-material existe
        .mockResolvedValueOnce([{ ...mockItemMaterial, isMainMaterial: false }]); // Respuesta para la actualización

      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      };

      const result = await service.update(1, updateDto);

      expect(result).toEqual(plainToInstance(ItemMaterialResDto, { ...mockItemMaterial, isMainMaterial: false }));
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException if item material does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El item-material no existe

      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      };

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return an item material', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItemMaterial]) // El item-material existe
        .mockResolvedValueOnce([mockItemMaterial]); // Respuesta para la eliminación

      const result = await service.remove(1);

      expect(result).toEqual(mockItemMaterial);
      expect(dbService.db.delete).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw NotFoundException if item material does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El item-material no existe

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});