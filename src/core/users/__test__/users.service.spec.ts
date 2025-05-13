import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { DatabaseService } from 'src/global/database/database.service';
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { USER_STATUS } from '../types/user-status.enum';
import { NotFoundException } from '@nestjs/common';
import { DisplayableException } from 'src/common/exceptions/displayable.exception';
import { plainToInstance } from 'class-transformer';
import { UserResDto } from '../dto/res/user-res.dto';
import { USER_TYPE } from '../types/user-type.enum';
import { HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let dbService: typeof mockDatabaseService;

    const mockUserRecord = {
        users: {
            id: 1,
            userName: 'johndoe',
            career: 'Software Engineer',
            userType: USER_TYPE.ADMINISTRATOR,
            status: USER_STATUS.ACTIVE,
            passwordHash: 'hashedpassword',
            personId: 1,
            registrationDate: new Date(),
            updateDate: new Date(),
        },
        people: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
        },
    };

    const mockUser = plainToInstance(UserResDto, {
        id: 1,
        userName: 'johndoe',
        career: 'Software Engineer',
        userType: USER_TYPE.ADMINISTRATOR,
        status: USER_STATUS.ACTIVE,
        person: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
        },
        registrationDate: new Date(),
        updateDate: new Date(),
    });

    beforeEach(async () => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        dbService = mockDatabaseService;

        // Espía el método findById para manipular su comportamiento en las pruebas
        jest.spyOn(service, 'findById');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a paginated list of users', async () => {
            dbService.db.execute
                .mockResolvedValueOnce([mockUserRecord]) // Respuesta para la consulta de registros
                .mockResolvedValueOnce([{ count: 1 }]); // Respuesta para el conteo total

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result).toEqual({
                records: [mockUser],
                total: 1,
                limit: 10,
                page: 1,
                pages: 1,
            });
            expect(dbService.db.select).toHaveBeenCalled();
            expect(dbService.db.from).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a user when found', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockUserRecord]);

            const result = await service.findById(1);

            expect(result).toEqual(mockUser);
            expect(dbService.db.select).toHaveBeenCalled();
            expect(dbService.db.from).toHaveBeenCalled();
            expect(dbService.db.where).toHaveBeenCalled();
        });

        it('should throw NotFoundException when user not found', async () => {
            dbService.db.execute.mockResolvedValueOnce([]);

            await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            dbService.db.execute.mockResolvedValueOnce([]); // No existe conflicto

            // Mock para los valores de retorno de las consultas dentro de la transacción
            const mockPersonId = { id: 1 };
            dbService.db.insert.mockReturnThis();
            dbService.db.values.mockReturnThis();
            dbService.db.returning.mockReturnThis();
            dbService.db.execute
                .mockResolvedValueOnce([[mockPersonId]]) // Para el insert de persona (retorna array con el objeto)
                .mockResolvedValueOnce([[{ id: 1 }]]); // Para el insert de usuario (retorna array con el objeto)

            const createDto: CreateUserDto = {
                userName: 'johndoe',
                password: '123456',
                career: 'Software Engineer',
                userType: USER_TYPE.ADMINISTRATOR,
                status: USER_STATUS.ACTIVE,
                person: {
                    firstName: 'John',
                    lastName: 'Doe',
                    dni: '12345678',
                    email: 'john.doe@example.com',
                },
            };

            await service.create(createDto);

            expect(dbService.db.transaction).toHaveBeenCalled();
            expect(dbService.db.insert).toHaveBeenCalledTimes(2); // Inserta persona y usuario
        });

        it('should throw DisplayableException if user already exists', async () => {
            dbService.db.execute.mockResolvedValueOnce([mockUserRecord]); // Ya existe un usuario

            const createDto: CreateUserDto = {
                userName: 'johndoe',
                password: '123456',
                career: 'Software Engineer',
                userType: USER_TYPE.ADMINISTRATOR,
                status: USER_STATUS.ACTIVE,
                person: {
                    firstName: 'John',
                    lastName: 'Doe',
                    dni: '12345678',
                    email: 'john.doe@example.com',
                },
            };

            await expect(service.create(createDto)).rejects.toThrow(DisplayableException);
        });
    });

    describe('update', () => {
        it('should create a new user', async () => {
            dbService.db.execute.mockResolvedValueOnce([]); // No existe conflicto

            // Mock para los valores de retorno de las consultas dentro de la transacción
            const mockPersonId = { id: 1 };
            dbService.db.insert.mockReturnThis();
            dbService.db.values.mockReturnThis();
            dbService.db.returning.mockReturnThis();
            dbService.db.execute
                .mockResolvedValueOnce([[mockPersonId]]) // Para el insert de persona (retorna array con el objeto)
                .mockResolvedValueOnce([[{ id: 1 }]]); // Para el insert de usuario (retorna array con el objeto)

            const createDto: CreateUserDto = {
                userName: 'johndoe',
                password: '123456',
                career: 'Software Engineer',
                userType: USER_TYPE.ADMINISTRATOR,
                status: USER_STATUS.ACTIVE,
                person: {
                    firstName: 'John',
                    lastName: 'Doe',
                    dni: '12345678',
                    email: 'john.doe@example.com',
                },
            };

            await service.create(createDto);

            expect(dbService.db.transaction).toHaveBeenCalled();
            expect(dbService.db.insert).toHaveBeenCalledTimes(2); // Inserta persona y usuario
        });

        it('should throw NotFoundException if user does not exist', async () => {
            // Hace que findById lance NotFoundException
            service.findById = jest.fn().mockRejectedValue(new NotFoundException(`User with id 999 not found`));

            const updateDto: UpdateUserDto = {
                userName: 'updatedUser',
            };

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw DisplayableException if updated data conflicts with another user', async () => {
            // Simula que el usuario existe
            service.findById = jest.fn().mockResolvedValue(mockUser);

            // Simula un conflicto con otro usuario
            dbService.db.execute.mockResolvedValueOnce([mockUserRecord]); // Encontró un conflicto

            const updateDto: UpdateUserDto = {
                userName: 'conflictingUser',
            };

            await expect(service.update(1, updateDto)).rejects.toThrow(DisplayableException);
        });
    });

    describe('changeStatus', () => {
        it('should change the status of a user', async () => {
            const inactiveMockUser = {
                ...mockUser,
                status: USER_STATUS.INACTIVE
            };

            // Configura findById para devolver el usuario
            service.findById = jest.fn()
                .mockResolvedValueOnce(mockUser) // Para verificación inicial
                .mockResolvedValueOnce(inactiveMockUser); // Para el resultado final después de la actualización

            await service.changeStatus(1, USER_STATUS.INACTIVE);

            expect(dbService.db.update).toHaveBeenCalled();
            expect(dbService.db.set).toHaveBeenCalledWith({ status: USER_STATUS.INACTIVE });
        });

        it('should throw NotFoundException if user does not exist', async () => {
            // Hace que findById lance NotFoundException
            service.findById = jest.fn().mockRejectedValue(new NotFoundException(`User with id 999 not found`));

            await expect(service.changeStatus(999, USER_STATUS.INACTIVE)).rejects.toThrow(NotFoundException);
        });
    });
});