import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from '../items.controller';
import { ItemsService } from '../items.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateItemDto } from '../dto/req/create-item.dto';
import { UpdateItemDto } from '../dto/req/update-item.dto';
import { NormativeType } from '../enums/normative-type.enum';
import { SimpleUserResDto } from 'src/core/auth/dto/res/simple-user-res.dto';
import { USER_TYPE } from 'src/core/users/types/user-type.enum';

jest.mock('src/core/auth/decorators/auth.decorator', () => ({
  Auth: jest.fn().mockImplementation(() => jest.fn()),
}));

jest.mock('src/core/auth/decorators/get-user.decorator', () => ({
  GetUser: jest.fn().mockImplementation(() => jest.fn()),
}));

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: jest.Mocked<ItemsService>;

  const mockItem = {
    id: 1,
    code: '10001',
    name: 'Laptop Dell XPS 13',
    description: 'Laptop para uso administrativo',
    itemTypeId: 1,
    categoryId: 1,
    statusId: 1,
    normativeType: 'PROPERTY',
    origin: 'PURCHASE',
    locationId: 1,
    custodianId: 1,
    availableForLoan: true,
    identifier: 'LAP-001',
    previousCode: '10000',
    conditionId: 1,
    certificateId: 1,
    entryOrigin: 'Compra',
    entryType: 'Compra',
    acquisitionDate: '2021-01-01',
    commitmentNumber: '1234567890',
    modelCharacteristics: 'Dell XPS 13',
    brandBreedOther: 'Dell',
    identificationSeries: '1234567890',
    warrantyDate: '2023-01-01',
    dimensions: '10x10x10',
    critical: false,
    dangerous: false,
    requiresSpecialHandling: false,
    perishable: false,
    expirationDate: '2025-01-01',
    itemLine: 1,
    accountingAccount: '1234567890',
    observations: 'Observaciones del item',
    registrationDate: new Date(),
    updateDate: new Date(),
  };

  const mockPaginatedResponse = {
    records: [mockItem],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockItemsService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockItem),
      create: jest.fn().mockResolvedValue(mockItem),
      update: jest.fn().mockResolvedValue({ ...mockItem, name: 'Updated Laptop' }),
      remove: jest.fn().mockResolvedValue(mockItem),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get(ItemsService) as jest.Mocked<ItemsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of items', async () => {
      const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

      const result = await controller.findAll(paginationDto);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should return a single item by id', async () => {
      const itemId = 1;

      const result = await controller.findOne(itemId);

      expect(result).toEqual(mockItem);
      expect(service.findOne).toHaveBeenCalledWith(itemId);
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      const createDto: CreateItemDto = {
        code: '10001',
        name: 'Laptop Dell XPS 13',
        itemTypeId: 1,
        categoryId: 1,
        statusId: 1,
        normativeType: NormativeType.PROPERTY,
      };

      const mockUser: SimpleUserResDto = {
        id: 1,
        username: 'admin',
        userType: USER_TYPE.ADMINISTRATOR,
        status: 'ACTIVE',
        career: 'Engineering',
        personId: 123
      };

      const result = await controller.create(createDto, mockUser);

      expect(result).toEqual(mockItem);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser.id);
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      const itemId = 1;
      const updateDto: UpdateItemDto = {
        name: 'Updated Laptop',
      };

      const result = await controller.update(itemId, updateDto);

      expect(result).toEqual({ ...mockItem, name: 'Updated Laptop' });
      expect(service.update).toHaveBeenCalledWith(itemId, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return an item', async () => {
      const itemId = 1;

      const result = await controller.remove(itemId);

      expect(result).toEqual(mockItem);
      expect(service.remove).toHaveBeenCalledWith(itemId);
    });
  });
});