import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from '../items.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateItemDto } from '../dto/req/create-item.dto';
import { UpdateItemDto } from '../dto/req/update-item.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';
import { plainToInstance } from 'class-transformer';
import { ItemResDto } from '../dto/res/item-res.dto';
import { NormativeType } from '../enums/normative-type.enum';

describe('ItemsService', () => {
  let service: ItemsService;
  let dbService: typeof mockDatabaseService;

  const mockItem = plainToInstance(ItemResDto, {
    id: 1,
    code: '10001',
    name: 'Laptop Dell XPS 13',
    description: 'Laptop para uso administrativo',
    itemTypeId: 1,
    categoryId: 1,
    statusId: 1,
    normativeType: 'PROPERTY',
    active: true,
    registrationDate: new Date(),
    updateDate: new Date(),
  });

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    dbService = mockDatabaseService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of items', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItem]) // Respuesta para la primera consulta (registros)
        .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        records: [mockItem],
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
    it('should return an item when found', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockItem]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockItem);
      expect(dbService.db.select).toHaveBeenCalled();
      expect(dbService.db.from).toHaveBeenCalled();
      expect(dbService.db.where).toHaveBeenCalled();
    });

    it('should throw NotFoundException when item not found', async () => {
      dbService.db.execute.mockResolvedValueOnce([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItem]); // Respuesta para la inserción

      const createDto: CreateItemDto = {
        code: '10001',
        name: 'Laptop Dell XPS 13',
        itemTypeId: 1,
        categoryId: 1,
        statusId: 1,
        normativeType: NormativeType.PROPERTY,
        
      };

      const result = await service.create(createDto, 1);

      expect(result).toEqual(mockItem);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(dbService.db.values).toHaveBeenCalledWith({
        ...createDto,
        registrationUserId: 1,
      });
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItem]) // El item existe
        .mockResolvedValueOnce([{ ...mockItem, name: 'Updated Laptop' }]); // Respuesta para la actualización

      const updateDto: UpdateItemDto = {
        name: 'Updated Laptop',
      };

      const result = await service.update(1, updateDto);

      expect(result).toEqual(plainToInstance(ItemResDto, { ...mockItem, name: 'Updated Laptop' }));
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith({
        ...updateDto,
        updateDate: expect.any(Date),
      });
    });

    it('should throw NotFoundException if item does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El item no existe

      const updateDto: UpdateItemDto = {
        name: 'Updated Laptop',
      };

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return an item', async () => {
      dbService.db.execute
        .mockResolvedValueOnce([mockItem]) // El item existe
        .mockResolvedValueOnce([{ ...mockItem, active: false }]); // Respuesta para la eliminación

      const result = await service.remove(1);

      expect(result).toEqual(plainToInstance(ItemResDto, { ...mockItem, active: false }));
      expect(dbService.db.update).toHaveBeenCalled();
      expect(dbService.db.set).toHaveBeenCalledWith({
        active: false,
        updateDate: expect.any(Date),
      });
    });

    it('should throw NotFoundException if item does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([]); // El item no existe

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});