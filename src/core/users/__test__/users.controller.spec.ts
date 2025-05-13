import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { ChangeUserStatusDto } from '../dto/req/change-user-status.dto';
import { BaseParamsDto } from 'src/common/dtos/base-params.dto';
import { UserResDto } from '../dto/res/user-res.dto';
import { USER_STATUS } from '../types/user-status.enum';
import { USER_TYPE } from '../types/user-type.enum';

describe('UsersController', () => {
    let controller: UsersController;
    let service: jest.Mocked<UsersService>;

    const mockUser = {
        id: 1,
        userName: 'johndoe',
        password: '123456',
        career: 'Software Engineer',
        userType: USER_TYPE.ADMINISTRATOR,
        status: USER_STATUS.ACTIVE,
        person: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            dni: '1805271937',
            email: 'davayme@gmail.com'
        },
        registrationDate: new Date(),
        updateDate: new Date(),
    };

    const mockPaginatedResponse = {
        records: [mockUser],
        total: 1,
        limit: 10,
        page: 1,
        pages: 1,
    };

    beforeEach(async () => {
        const mockUsersService = {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
            findById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue({ ...mockUser, userName: 'updatedUser' }),
            changeStatus: jest.fn().mockResolvedValue({ ...mockUser, status: USER_STATUS.INACTIVE }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get(UsersService) as jest.Mocked<UsersService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create and return a new user', async () => {
            const createDto: CreateUserDto = {
                userName: 'johndoe',
                password: '123456',
                career: 'Software Engineer',
                userType: USER_TYPE.ADMINISTRATOR,
                status: USER_STATUS.ACTIVE,
                person: {
                    firstName: 'John',
                    lastName: 'Doe',
                    dni: '1805271937',
                    email: 'dayme@gmail.com'
                },
            };

            const result = await controller.create(createDto);

            expect(result).toEqual(mockUser);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findAll', () => {
        it('should return a paginated list of users', async () => {
            const paginationDto: BaseParamsDto = { page: 1, limit: 10 };

            const result = await controller.findAll(paginationDto);

            expect(result).toEqual(mockPaginatedResponse);
            expect(service.findAll).toHaveBeenCalledWith(paginationDto);
        });
    });

    describe('findById', () => {
        it('should return a user by id', async () => {
            const userId = 1;

            const result = await controller.findById(userId);

            expect(result).toEqual(mockUser);
            expect(service.findById).toHaveBeenCalledWith(userId);
        });
    });

    describe('update', () => {
        it('should update and return a user', async () => {
            const userId = 1;
            const updateDto: UpdateUserDto = {
                userName: 'updatedUser',
            };

            const result = await controller.update(userId, updateDto);

            expect(result).toEqual({ ...mockUser, userName: 'updatedUser' });
            expect(service.update).toHaveBeenCalledWith(userId, updateDto);
        });
    });

    describe('changeStatus', () => {
        it('should change the status of a user and return the updated user', async () => {
            const userId = 1;
            const changeStatusDto: ChangeUserStatusDto = {
                status: USER_STATUS.INACTIVE,
            };

            const result = await controller.changeStatus(userId, changeStatusDto);

            expect(result).toEqual({ ...mockUser, status: USER_STATUS.INACTIVE });
            expect(service.changeStatus).toHaveBeenCalledWith(userId, changeStatusDto.status);
        });
    });
});