import { Test, TestingModule } from '@nestjs/testing';
import { AssetsValueController } from '../assets-value.controller';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateAssetValueDto } from '../dto/req/create-asset-value.dto';
import { UpdateAssetValueDto } from '../dto/req/update-asset-value.dto';
import { AssetsValueService } from '../assets-value.service';

describe('AssetsValueController', () => {
  let controller: AssetsValueController;
  let service: jest.Mocked<AssetsValueService>;

  const mockAssetValue = {
    id: 1,
    itemId: 1,
    currency: 'USD',
    purchaseValue: '1000.00',
    repurchase: false,
    depreciable: true,
    entryDate: '2023-10-01',
    usefulLife: 5,
    depreciationEndDate: '2028-10-01',
    bookValue: '800.00',
    residualValue: '200.00',
    ledgerValue: '800.00',
    lastDepreciationDate: new Date(),
    accumulatedDepreciationValue: '200.00',
    onLoan: false,
  };

  const mockPaginatedResponse = {
    records: [mockAssetValue],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockAssetsValueService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findByItemId: jest.fn().mockResolvedValue(mockAssetValue),
      create: jest.fn().mockResolvedValue(mockAssetValue),
      update: jest.fn().mockResolvedValue({ ...mockAssetValue, currency: 'EUR' }),
      remove: jest.fn().mockResolvedValue(mockAssetValue),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsValueController],
      providers: [
        {
          provide: AssetsValueService,
          useValue: mockAssetsValueService,
        },
      ],
    }).compile();

    controller = module.get<AssetsValueController>(AssetsValueController);
    service = module.get(AssetsValueService) as jest.Mocked<AssetsValueService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of asset values', async () => {
    const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

    const result = await controller.findAll(paginationDto);

    expect(result).toEqual(mockPaginatedResponse);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('should return a single asset value by itemId', async () => {
    const itemId = 1;

    const result = await controller.findOne(itemId);

    expect(result).toEqual(mockAssetValue);
    expect(service.findByItemId).toHaveBeenCalledWith(itemId);
  });

  it('should create and return a new asset value', async () => {
    const createDto: CreateAssetValueDto = {
      itemId: 1,
      currency: 'USD',
      purchaseValue: '1000.00',
      repurchase: false,
      depreciable: true,
      entryDate: '2023-10-01',
      usefulLife: 5,
      depreciationEndDate: '2028-10-01',
      bookValue: '800.00',
      residualValue: '200.00',
      ledgerValue: '800.00',
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(mockAssetValue);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should update and return an asset value', async () => {
    const itemId = 1;
    const updateDto: UpdateAssetValueDto = { currency: 'EUR' };

    const result = await controller.update(itemId, updateDto);

    expect(result).toEqual({ ...mockAssetValue, currency: 'EUR' });
    expect(service.update).toHaveBeenCalledWith(itemId, updateDto);
  });

  it('should remove an asset value and return it', async () => {
    const itemId = 1;

    const result = await controller.remove(itemId);

    expect(result).toEqual(mockAssetValue);
    expect(service.remove).toHaveBeenCalledWith(itemId);
  });
});