import { Test, TestingModule } from '@nestjs/testing';
import { ItemMaterialsController } from '../item-materials.controller';
import { ItemMaterialsService } from '../item-materials.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateItemMaterialDto } from '../dto/req/create-item-material.dto';
import { UpdateItemMaterialDto } from '../dto/req/update-item-material.dto';

describe('ItemMaterialsController', () => {
  let controller: ItemMaterialsController;
  let service: jest.Mocked<ItemMaterialsService>;

  const mockItemMaterial = {
    id: 1,
    itemId: 1,
    materialId: 2,
    isMainMaterial: true,
    updateDate: new Date(),
  };

  const mockPaginatedResponse = {
    records: [mockItemMaterial],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockItemMaterialsService = {
      findByItemId: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockItemMaterial),
      create: jest.fn().mockResolvedValue(mockItemMaterial),
      update: jest.fn().mockResolvedValue({ ...mockItemMaterial, isMainMaterial: false }),
      remove: jest.fn().mockResolvedValue(mockItemMaterial),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemMaterialsController],
      providers: [
        {
          provide: ItemMaterialsService,
          useValue: mockItemMaterialsService,
        },
      ],
    }).compile();

    controller = module.get<ItemMaterialsController>(ItemMaterialsController);
    service = module.get(ItemMaterialsService) as jest.Mocked<ItemMaterialsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of item materials for a specific item', async () => {
      const paginationDto: BaseParamsDto = { page: 1, limit: 10 };
      const itemId = 1;

      const result = await controller.findAll(itemId, paginationDto);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findByItemId).toHaveBeenCalledWith(paginationDto, itemId);
    });
  });

  describe('findOne', () => {
    it('should return a single item material by id', async () => {
      const itemMaterialId = 1;

      const result = await controller.findOne(itemMaterialId);

      expect(result).toEqual(mockItemMaterial);
      expect(service.findOne).toHaveBeenCalledWith(itemMaterialId);
    });
  });

  describe('create', () => {
    it('should create and return a new item material', async () => {
      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      };

      const result = await controller.create(createDto);

      expect(result).toEqual(mockItemMaterial);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return an item material', async () => {
      const itemMaterialId = 1;
      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      };

      const result = await controller.update(itemMaterialId, updateDto);

      expect(result).toEqual({ ...mockItemMaterial, isMainMaterial: false });
      expect(service.update).toHaveBeenCalledWith(itemMaterialId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return an item material', async () => {
      const itemMaterialId = 1;

      const result = await controller.remove(itemMaterialId);

      expect(result).toEqual(mockItemMaterial);
      expect(service.remove).toHaveBeenCalledWith(itemMaterialId);
    });
  });
});