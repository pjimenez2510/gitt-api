import { Test, TestingModule } from '@nestjs/testing';
import { ColorsService } from '../colors.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateColorDto } from '../dto/req/create-color.dto';
import { UpdateColorDto } from '../dto/req/update-color.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';
import { plainToInstance } from 'class-transformer';
import { ColorResDto } from '../dto/res/color-res.dto';

describe('ColorsService', () => {
    let service: ColorsService;
    let dbService: typeof mockDatabaseService;

    const mockColor = plainToInstance(ColorResDto, {
        id: 1,
        name: 'Rojo',
        hexCode: '#FF0000',
        description: 'Color rojo brillante',
        active: true,
        registrationDate: undefined,
        updateDate: undefined,
    });

    beforeEach(async () => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ColorsService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<ColorsService>(ColorsService);
        dbService = mockDatabaseService;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a paginated list of colors', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockColor]) // Respuesta para la primera consulta (registros)
                .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result).toEqual({
                records: [mockColor],
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
        it('should return a color when found', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockColor]);

            const result = await service.findOne(1);

            expect(result).toEqual(mockColor);
            expect(dbService.db.select).toHaveBeenCalled();
            expect(dbService.db.from).toHaveBeenCalled();
            expect(dbService.db.where).toHaveBeenCalled();
        });

        it('should throw NotFoundException when color not found', async () => {
            dbService.db.execute.mockResolvedValueOnce([]);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create and return a new color', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([]) // No existe un color con el mismo nombre
                .mockResolvedValueOnce([mockColor]); // Respuesta para la inserción

            const createDto: CreateColorDto = {
                name: 'Rojo',
                hexCode: '#FF0000',
                description: 'Color rojo brillante',
            };

            const result = await service.create(createDto);

            expect(result).toEqual(mockColor);
            expect(dbService.db.insert).toHaveBeenCalled();
            expect(dbService.db.values).toHaveBeenCalledWith({
                name: createDto.name,
                hexCode: createDto.hexCode,
                description: createDto.description,
            });
        });

        it('should throw DisplayableException if color name already exists', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockColor]); // Ya existe un color con el mismo nombre

            const createDto: CreateColorDto = {
                name: 'Rojo',
                hexCode: '#FF0000',
                description: 'Color rojo brillante',
            };

            await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
        });
    });

    describe('update', () => {
        it('should update and return a color', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockColor]) // El color existe
                .mockResolvedValueOnce([]) // No hay conflicto con el nombre
                .mockResolvedValueOnce([{ ...mockColor, name: 'Azul' }]); // Respuesta para la actualización

            const updateDto: UpdateColorDto = {
                name: 'Azul',
                hexCode: '#0000FF',
                description: 'Color azul intenso',
            };

            const result = await service.update(1, updateDto);

            expect(result).toEqual(plainToInstance(ColorResDto, { ...mockColor, name: 'Azul' }));
            expect(dbService.db.update).toHaveBeenCalled();
            expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
        });
    });

    describe('remove', () => {
        it('should remove and return a color', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockColor]) // El color existe
                .mockResolvedValueOnce([{ ...mockColor, active: false }]); // Respuesta para la eliminación

            const result = await service.remove(1);

            expect(result).toEqual(
                plainToInstance(ColorResDto, { ...mockColor, active: false }),
            );
            expect(dbService.db.update).toHaveBeenCalled();
            expect(dbService.db.set).toHaveBeenCalledWith({ active: false, updateDate: expect.any(Date) });
        });
    });
});