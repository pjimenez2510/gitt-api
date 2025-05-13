import { Test, TestingModule } from '@nestjs/testing';
import { ItemColorsService } from '../item-colors.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateItemColorDto } from '../dto/req/create-item-color.dto';
import { UpdateItemColorDto } from '../dto/req/update-item-color.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';
import { plainToInstance } from 'class-transformer';
import { ItemColorResDto } from '../dto/res/item-color-res.dto';

describe('ItemColorsService', () => {
  let service: ItemColorsService;
  let dbService: typeof mockDatabaseService;

  const mockItemColor = plainToInstance(ItemColorResDto, {
    id: 1,
    itemId: 1,
    colorId: 2,
    isMainColor: true,
    registrationDate: undefined,
    updateDate: undefined,
  });

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemColorsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ItemColorsService>(ItemColorsService);
    dbService = mockDatabaseService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByItemId', () => {
    it('should return a paginated list of item colors for a specific item', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItemColor]) // Respuesta para la primera consulta (registros)
        .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

      const result = await service.findByItemId({ page: 1, limit: 10 }, 1);

      expect(result).toEqual({
        records: [mockItemColor],
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
    it('should return an item color when found', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockItemColor]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockItemColor);
      expect(dbService.db.select).toHaveBeenCalled();
      expect(dbService.db.from).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalled();
    });

    it('should throw NotFoundException when item color not found', async () => {
      dbService.db.execute.mockResolvedValueOnce([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new item color', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([]) // No existe una combinación de item y color
        .mockResolvedValueOnce([mockItemColor]); // Respuesta para la inserción

      const createDto: CreateItemColorDto = {
        itemId: 1,
        colorId: 2,
        isMainColor: true,
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockItemColor);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(dbService.db.values).toHaveBeenCalledWith(createDto);
    });

    it('should throw DisplayableException if item-color combination already exists', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockItemColor]); // Ya existe una combinación de item y color

      const createDto: CreateItemColorDto = {
        itemId: 1,
        colorId: 2,
        isMainColor: true,
      };

      await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
    });
  });

  describe('update', () => {
    it('should update and return an item color', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItemColor]) // El item-color existe
        .mockResolvedValueOnce([{ ...mockItemColor, isMainColor: false }]); // Respuesta para la actualización

      const updateDto: UpdateItemColorDto = {
        isMainColor: false,
      };

      const result = await service.update(1, updateDto);

      expect(result).toEqual(plainToInstance(ItemColorResDto, { ...mockItemColor, isMainColor: false }));
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException if item color does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El item-color no existe

      const updateDto: UpdateItemColorDto = {
        isMainColor: false,
      };

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return an item color', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItemColor]) // El item-color existe
        .mockResolvedValueOnce([mockItemColor]); // Respuesta para la eliminación

      const result = await service.remove(1);

      expect(result).toEqual(mockItemColor);
      expect(dbService.db.delete).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw NotFoundException if item color does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El item-color no existe

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});