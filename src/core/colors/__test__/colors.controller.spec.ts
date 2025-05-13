import { Test, TestingModule } from '@nestjs/testing';
import { ColorsController } from '../colors.controller';
import { ColorsService } from '../colors.service';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { CreateColorDto } from '../dto/req/create-color.dto';
import { UpdateColorDto } from '../dto/req/update-color.dto';

describe('ColorsController', () => {
    let controller: ColorsController;
    let service: jest.Mocked<ColorsService>;

    const mockColor = {
        id: 1,
        name: 'Rojo',
        hexCode: '#FF0000',
        description: 'Color rojo brillante',
    };

    const mockPaginatedResponse = {
        records: [mockColor],
        total: 1,
        limit: 10,
        page: 1,
        pages: 1,
    };

    beforeEach(async () => {
        const mockColorsService = {
            findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
            findOne: jest.fn().mockResolvedValue(mockColor),
            create: jest.fn().mockResolvedValue(mockColor),
            update: jest.fn().mockResolvedValue({ ...mockColor, name: 'Azul' }),
            remove: jest.fn().mockResolvedValue(mockColor),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ColorsController],
            providers: [
                {
                    provide: ColorsService,
                    useValue: mockColorsService,
                },
            ],
        }).compile();

        controller = module.get<ColorsController>(ColorsController);
        service = module.get(ColorsService) as jest.Mocked<ColorsService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return a paginated list of colors', async () => {
        const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

        const result = await controller.findAll(paginationDto);

        expect(result).toEqual(mockPaginatedResponse);
        expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it('should return a single color by id', async () => {
        const colorId = 1;

        const result = await controller.findOne(colorId);

        expect(result).toEqual(mockColor);
        expect(service.findOne).toHaveBeenCalledWith(colorId);
    });

    it('should create and return a new color', async () => {
        const createDto: CreateColorDto = {
            name: 'Rojo',
            hexCode: '#FF0000',
            description: 'Color rojo brillante',
        };

        const result = await controller.create(createDto);

        expect(result).toEqual(mockColor);
        expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should update and return a color', async () => {
        const colorId = 1;
        const updateDto: UpdateColorDto = {
            name: 'Azul',
            hexCode: '#0000FF',
            description: 'Color azul intenso',
        };

        const result = await controller.update(colorId, updateDto);

        expect(result).toEqual({ ...mockColor, name: 'Azul' });
        expect(service.update).toHaveBeenCalledWith(colorId, updateDto);
    });

    it('should remove a color and return it', async () => {
        const colorId = 1;

        const result = await controller.remove(colorId);

        expect(result).toEqual(mockColor);
        expect(service.remove).toHaveBeenCalledWith(colorId);
    });
});