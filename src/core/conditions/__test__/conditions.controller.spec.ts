import { Test, TestingModule } from '@nestjs/testing';
import { ConditionsController } from '../conditions.controller';
import { ConditionsService } from '../conditions.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateConditionDto } from '../dto/req/create-condition.dto';
import { UpdateConditionDto } from '../dto/req/update-condition.dto';


describe('ConditionsController', () => {
  let controller: ConditionsController;
  let service: jest.Mocked<ConditionsService>;

  const mockCondition = {
    id: 1,
    name: 'Nuevo',
    description: 'Condición para ítems nuevos sin uso',
    requiresMaintenance: false,
    active: true,
    registrationDate: undefined,
    updateDate: undefined,
  };

  const mockPaginatedResponse = {
    records: [mockCondition],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  };

  beforeEach(async () => {
    const mockConditionsService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockCondition),
      create: jest.fn().mockResolvedValue(mockCondition),
      update: jest.fn().mockResolvedValue({ ...mockCondition, name: 'Usado' }),
      remove: jest.fn().mockResolvedValue(mockCondition),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionsController],
      providers: [
        {
          provide: ConditionsService,
          useValue: mockConditionsService,
        },
      ],
    }).compile();

    controller = module.get<ConditionsController>(ConditionsController);
    service = module.get(ConditionsService) as jest.Mocked<ConditionsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of conditions', async () => {
    const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

    const result = await controller.findAll(paginationDto);

    expect(result).toEqual(mockPaginatedResponse);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('should return a single condition by id', async () => {
    const conditionId = 1;

    const result = await controller.findOne(conditionId);

    expect(result).toEqual(mockCondition);
    expect(service.findOne).toHaveBeenCalledWith(conditionId);
  });

  it('should create and return a new condition', async () => {
    const createDto: CreateConditionDto = {
      name: 'Nuevo',
      description: 'Condición para ítems nuevos sin uso',
      requiresMaintenance: false,
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(mockCondition);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should update and return a condition', async () => {
    const conditionId = 1;
    const updateDto: UpdateConditionDto = {
      name: 'Usado',
      description: 'Condición para ítems usados en buen estado',
      requiresMaintenance: true,
    };

    const result = await controller.update(conditionId, updateDto);

    expect(result).toEqual({ ...mockCondition, name: 'Usado' });
    expect(service.update).toHaveBeenCalledWith(conditionId, updateDto);
  });

  it('should remove a condition and return it', async () => {
    const conditionId = 1;

    const result = await controller.remove(conditionId);

    expect(result).toEqual(mockCondition);
    expect(service.remove).toHaveBeenCalledWith(conditionId);
  });
});