import { Test, TestingModule } from '@nestjs/testing';
import { AssetsValueService } from '../assets-value.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { UpdateAssetValueDto } from '../dto/req/update-asset-value.dto';
import { NotFoundException } from '@nestjs/common';

describe('AssetsValueService', () => {
    let service: AssetsValueService;
    let dbService: typeof mockDatabaseService;

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

    beforeEach(async () => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssetsValueService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<AssetsValueService>(AssetsValueService);
        dbService = mockDatabaseService;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a paginated list of asset values', async () => {
            // Mock para la consulta de registros
            dbService.db.execute
                .mockResolvedValueOnce([mockAssetValue]) // Respuesta para la primera consulta (registros)
                .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para la segunda consulta (conteo)

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result).toEqual({
                records: [mockAssetValue],
                total: 1,
                limit: 10,
                page: 1,
                pages: 1,
            });
            expect(dbService.db.select).toHaveBeenCalled();
            expect(dbService.db.from).toHaveBeenCalled();
        });
    });

    describe('findByItemId', () => {
        it('should return an asset value when found', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockAssetValue]);

            const result = await service.findByItemId(1);

            expect(result).toEqual(mockAssetValue);
            expect(dbService.db.select).toHaveBeenCalled();
            expect(dbService.db.from).toHaveBeenCalled();
            expect(dbService.db.where).toHaveBeenCalled();
        });

        it('should throw NotFoundException when asset value not found', async () => {
            dbService.db.execute.mockResolvedValueOnce([]);

            await expect(service.findByItemId(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update and return an asset value', async () => {
            // Mock para encontrar el registro
            dbService.db.execute.mockResolvedValueOnce([mockAssetValue]);

            // Mock para la operación de actualización
            dbService.db.execute.mockResolvedValueOnce([{ ...mockAssetValue, currency: 'EUR' }]);

            const updateDto: UpdateAssetValueDto = { currency: 'EUR' };

            const result = await service.update(1, updateDto);

            expect(result).toEqual({ ...mockAssetValue, currency: 'EUR' });
            expect(dbService.db.update).toHaveBeenCalled();
            expect(dbService.db.set).toHaveBeenCalledWith(updateDto);
        });
    });

    describe('remove', () => {
        it('should remove and return an asset value', async () => {
            // Mock para encontrar el registro
            dbService.db.execute.mockResolvedValueOnce([mockAssetValue]);

            // Mock para la operación de eliminación
            dbService.db.execute.mockResolvedValueOnce([mockAssetValue]);

            const result = await service.remove(1);

            expect(result).toEqual(mockAssetValue);
            expect(dbService.db.delete).toHaveBeenCalled();
        });

        it('should throw NotFoundException if asset value is not found', async () => {
            // Mock para no encontrar el registro
            dbService.db.execute.mockResolvedValueOnce([]);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});