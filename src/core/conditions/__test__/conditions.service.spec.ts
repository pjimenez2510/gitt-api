import { Test, TestingModule } from '@nestjs/testing';
import { ConditionsService } from '../conditions.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateConditionDto } from '../dto/req/create-condition.dto';
import { UpdateConditionDto } from '../dto/req/update-condition.dto';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';
import { plainToInstance } from 'class-transformer';
import { ConditionResDto } from '../dto/res/condition-res.dto';

describe('ConditionsService', () => {
    let service: ConditionsService;
    let dbService: typeof mockDatabaseService;

    const mockCondition = plainToInstance(ConditionResDto, {
        id: 1,
        name: 'Nuevo',
        description: 'Condición para ítems nuevos sin uso',
        requiresMaintenance: false,
        active: true,
        registrationDate: undefined,
        updateDate: undefined,
    });

    beforeEach(async () => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConditionsService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<ConditionsService>(ConditionsService);
        dbService = mockDatabaseService;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a paginated list of conditions', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockCondition]) // Respuesta para la primera consulta (registros)
                .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result).toEqual({
                records: [mockCondition],
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
        it('should return a condition when found', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockCondition]);

            const result = await service.findOne(1);

            expect(result).toEqual(mockCondition);
            expect(dbService.db.select).toHaveBeenCalled();
            expect(dbService.db.from).toHaveBeenCalled();
            expect(dbService.db.where).toHaveBeenCalled();
        });

        it('should throw NotFoundException when condition not found', async () => {
            dbService.db.execute.mockResolvedValueOnce([]);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create and return a new condition', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([]) // No existe una condición con el mismo nombre
                .mockResolvedValueOnce([mockCondition]); // Respuesta para la inserción

            const createDto: CreateConditionDto = {
                name: 'Nuevo',
                description: 'Condición para ítems nuevos sin uso',
                requiresMaintenance: false,
            };

            const result = await service.create(createDto);

            expect(result).toEqual(mockCondition);
            expect(dbService.db.insert).toHaveBeenCalled();
            expect(dbService.db.values).toHaveBeenCalledWith({
                name: createDto.name,
                description: createDto.description,
                requiresMaintenance: createDto.requiresMaintenance,
            });
        });

        it('should throw DisplayableException if condition name already exists', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockCondition]); // Ya existe una condición con el mismo nombre

            const createDto: CreateConditionDto = {
                name: 'Nuevo',
                description: 'Condición para ítems nuevos sin uso',
                requiresMaintenance: false,
            };

            await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
        });
    });

    describe('update', () => {
        it('should update and return a condition', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockCondition]) // La condición existe
                .mockResolvedValueOnce([]) // No hay conflicto con el nombre
                .mockResolvedValueOnce([{ ...mockCondition, name: 'Usado' }]); // Respuesta para la actualización

            const updateDto: UpdateConditionDto = {
                name: 'Usado',
                description: 'Condición para ítems usados en buen estado',
                requiresMaintenance: true,
            };

            const result = await service.update(1, updateDto);

            expect(result).toEqual(plainToInstance(ConditionResDto, { ...mockCondition, name: 'Usado' }));
            expect(dbService.db.update).toHaveBeenCalled();
            expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
        });

        it('should throw NotFoundException if condition does not exist', async () => {
            dbService.db.execute.mockResolvedValueOnce([]); // La condición no existe

            const updateDto: UpdateConditionDto = {
                name: 'Usado',
                description: 'Condición para ítems usados en buen estado',
                requiresMaintenance: true,
            };

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw DisplayableException if condition name already exists', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockCondition]) // La condición existe
                .mockResolvedValueOnce([mockCondition]); // Ya existe una condición con el mismo nombre

            const updateDto: UpdateConditionDto = {
                name: 'Nuevo',
                description: 'Condición para ítems nuevos sin uso',
                requiresMaintenance: false,
            };

            await expect(service.update(1, updateDto)).rejects.toThrow(DisplayableException);
        });
    });

    describe('remove', () => {
        it('should remove and return a condition', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockCondition]) // La condición existe
                .mockResolvedValueOnce([{ ...mockCondition, active: false }]); // Respuesta para la eliminación

            const result = await service.remove(1);

            expect(result).toEqual(plainToInstance(ConditionResDto, { ...mockCondition, active: false }));
            expect(dbService.db.update).toHaveBeenCalled();
            expect(dbService.db.set).toHaveBeenCalledWith({ active: false, updateDate: expect.any(Date) });
        });

        it('should throw NotFoundException if condition does not exist', async () => {
            dbService.db.execute.mockResolvedValueOnce([]); // La condición no existe

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});