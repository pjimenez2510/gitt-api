import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateCategoryDto } from '../dto/req/create-category.dto';
import { UpdateCategoryDto } from '../dto/req/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: jest.Mocked<CategoriesService>;

  const mockCategory = {
    id: 1,
    code: 'CAT001',
    name: 'Electronics',
    description: 'Category for electronic items',
    parentCategoryId: undefined,
    standardUsefulLife: 5,
    depreciationPercentage: '10.00',
  };

  const mockPaginatedResponse = {
    records: [mockCategory],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockCategoriesService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockCategory),
      create: jest.fn().mockResolvedValue(mockCategory),
      update: jest.fn().mockResolvedValue({ ...mockCategory, name: 'Updated Electronics' }),
      remove: jest.fn().mockResolvedValue(mockCategory),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService) as jest.Mocked<CategoriesService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of categories', async () => {
    const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

    const result = await controller.findAll(paginationDto);

    expect(result).toEqual(mockPaginatedResponse);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('should return a single category by id', async () => {
    const categoryId = 1;

    const result = await controller.findOne(categoryId);

    expect(result).toEqual(mockCategory);
    expect(service.findOne).toHaveBeenCalledWith(categoryId);
  });

  it('should create and return a new category', async () => {
    const createDto: CreateCategoryDto = {
      code: 'CAT001',
      name: 'Electronics',
      description: 'Category for electronic items',
      parentCategoryId: undefined,
      standardUsefulLife: 5,
      depreciationPercentage: '10.00',
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(mockCategory);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should update and return a category', async () => {
    const categoryId = 1;
    const updateDto: UpdateCategoryDto = {
      name: 'Updated Electronics',
      description: 'Updated description',
    };

    const result = await controller.update(categoryId, updateDto);

    expect(result).toEqual({ ...mockCategory, name: 'Updated Electronics' });
    expect(service.update).toHaveBeenCalledWith(categoryId, updateDto);
  });

  it('should remove a category and return it', async () => {
    const categoryId = 1;

    const result = await controller.remove(categoryId);

    expect(result).toEqual(mockCategory);
    expect(service.remove).toHaveBeenCalledWith(categoryId);
  });
});