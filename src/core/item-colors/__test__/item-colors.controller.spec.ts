import { Test, TestingModule } from '@nestjs/testing';
import { ItemColorsController } from '../item-colors.controller';
import { ItemColorsService } from '../item-colors.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateItemColorDto } from '../dto/req/create-item-color.dto';
import { UpdateItemColorDto } from '../dto/req/update-item-color.dto';
import { ItemColorResDto } from '../dto/res/item-color-res.dto';

describe('ItemColorsController', () => {
  let controller: ItemColorsController;
  let service: jest.Mocked<ItemColorsService>;

  const mockItemColor = {
    id: 1,
    itemId: 1,
    colorId: 2,
    isMainColor: true,
    updateDate: new Date(),
  };

  const mockPaginatedResponse = {
    records: [mockItemColor],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockItemColorsService = {
      findByItemId: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockItemColor),
      create: jest.fn().mockResolvedValue(mockItemColor),
      update: jest.fn().mockResolvedValue({ ...mockItemColor, isMainColor: false }),
      remove: jest.fn().mockResolvedValue(mockItemColor),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemColorsController],
      providers: [
        {
          provide: ItemColorsService,
          useValue: mockItemColorsService,
        },
      ],
    }).compile();

    controller = module.get<ItemColorsController>(ItemColorsController);
    service = module.get(ItemColorsService) as jest.Mocked<ItemColorsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of item colors for a specific item', async () => {
      const paginationDto: BaseParamsDto = { page: 1, limit: 10 };
      const itemId = 1;

      const result = await controller.findAll(itemId, paginationDto);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findByItemId).toHaveBeenCalledWith(paginationDto, itemId);
    });
  });

  describe('findOne', () => {
    it('should return a single item color by id', async () => {
      const itemColorId = 1;

      const result = await controller.findOne(itemColorId);

      expect(result).toEqual(mockItemColor);
      expect(service.findOne).toHaveBeenCalledWith(itemColorId);
    });
  });

  describe('create', () => {
    it('should create and return a new item color', async () => {
      const createDto: CreateItemColorDto = {
        itemId: 1,
        colorId: 2,
        isMainColor: true,
      };

      const result = await controller.create(createDto);

      expect(result).toEqual(mockItemColor);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return an item color', async () => {
      const itemColorId = 1;
      const updateDto: UpdateItemColorDto = {
        isMainColor: false,
      };

      const result = await controller.update(itemColorId, updateDto);

      expect(result).toEqual({ ...mockItemColor, isMainColor: false });
      expect(service.update).toHaveBeenCalledWith(itemColorId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return an item color', async () => {
      const itemColorId = 1;

      const result = await controller.remove(itemColorId);

      expect(result).toEqual(mockItemColor);
      expect(service.remove).toHaveBeenCalledWith(itemColorId);
    });
  });
});