import { Test, TestingModule } from '@nestjs/testing';
import { ItemTypesController } from '../item-types.controller';
import { ItemTypesService } from '../item-types.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateItemTypeDto } from '../dto/req/create-item-type.dto';
import { UpdateItemTypeDto } from '../dto/req/update-item-type.dto';

describe('ItemTypesController', () => {
  let controller: ItemTypesController;
  let service: jest.Mocked<ItemTypesService>;

  const mockItemType = {
    id: 1,
    code: 'IT001',
    name: 'Mobiliario',
    description: 'Tipo para muebles y enseres',
    active: true,
    registrationDate: new Date(),
    updateDate: new Date(),
  };

  const mockPaginatedResponse = {
    records: [mockItemType],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockItemTypesService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockItemType),
      create: jest.fn().mockResolvedValue(mockItemType),
      update: jest.fn().mockResolvedValue({ ...mockItemType, name: 'Electrónicos' }),
      remove: jest.fn().mockResolvedValue(mockItemType),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemTypesController],
      providers: [
        {
          provide: ItemTypesService,
          useValue: mockItemTypesService,
        },
      ],
    }).compile();

    controller = module.get<ItemTypesController>(ItemTypesController);
    service = module.get(ItemTypesService) as jest.Mocked<ItemTypesService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of item types', async () => {
      const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should return a single item type by id', async () => {
      const itemTypeId = 1;

      const result = await controller.findOne(itemTypeId);

      expect(result).toEqual(mockItemType);
      expect(service.findOne).toHaveBeenCalledWith(itemTypeId);
    });
  });

  describe('create', () => {
    it('should create and return a new item type', async () => {
      const createDto: CreateItemTypeDto = {
        code: 'IT001',
        name: 'Mobiliario',
        description: 'Tipo para muebles y enseres',
        active: true,
      };

      const result = await controller.create(createDto);

      expect(result).toEqual(mockItemType);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return an item type', async () => {
      const itemTypeId = 1;
      const updateDto: UpdateItemTypeDto = {
        name: 'Electrónicos',
        description: 'Tipo para dispositivos electrónicos',
        active: true,
      };

      const result = await controller.update(itemTypeId, updateDto);

      expect(result).toEqual({ ...mockItemType, name: 'Electrónicos' });
      expect(service.update).toHaveBeenCalledWith(itemTypeId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return an item type', async () => {
      const itemTypeId = 1;

      const result = await controller.remove(itemTypeId);

      expect(result).toEqual(mockItemType);
      expect(service.remove).toHaveBeenCalledWith(itemTypeId);
    });
  });
});