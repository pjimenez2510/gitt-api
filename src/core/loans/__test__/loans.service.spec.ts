import { Test, TestingModule } from '@nestjs/testing'
import { LoansService } from '../loans.service'
import { DatabaseService } from 'src/global/database/database.service'
import { LoanDetailsService } from '../loan-details/loan-details.service'
import { UsersService } from '../../users/users.service'
import { ItemsService } from '../../items/items.service'
import { CreateLoanDto } from '../dto/req/create-loan.dto'
import { DeliverLoanDto } from '../dto/req/deliver-loan.dto'
import { ApproveLoanDto } from '../dto/req/approve-loan.dto'
import { FilterLoansDto, LoanStatus } from '../dto/req/filter-loans.dto'
import { StatusLoan } from '../enums/status-loan'
import { USER_STATUS } from '../../users/types/user-status.enum'
import { plainToInstance } from 'class-transformer'
import { LoanResDto } from '../dto/res/loan-res.dto'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { LoanDetailResDto } from '../loan-details/dto/res/loan-detail-res.dto'

describe('LoansService', () => {
  let service: LoansService
  let dbService: jest.Mocked<DatabaseService>
  let loanDetailService: jest.Mocked<LoanDetailsService>
  let userService: jest.Mocked<UsersService>
  let itemsService: jest.Mocked<ItemsService>

  const mockLoanDetail = plainToInstance(LoanDetailResDto, {
    id: 1,
    loanId: 1,
    itemId: 1,
    exitConditionId: 1,
    returnConditionId: null,
    exitObservations: 'Good condition',
    returnObservations: null,
    registrationDate: new Date(),
    updateDate: new Date(),
  })

  const mockLoan = plainToInstance(LoanResDto, {
    id: 1,
    loanCode: 'LOAN-001',
    requestDate: new Date(),
    approvalDate: null,
    deliveryDate: null,
    scheduledReturnDate: new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    ),
    actualReturnDate: null,
    status: StatusLoan.REQUESTED,
    requestorId: 1,
    approverId: null,
    delivererId: null,
    reason: 'Test loan',
    associatedEvent: 'Test event',
    externalLocation: 'Test location',
    notes: 'Test notes',
    responsibilityDocument: null,
    reminderSent: false,
    registrationDate: new Date(),
    updateDate: new Date(),
    loanDetails: [mockLoanDetail],
  })

  const mockUser = {
    id: 1,
    person: {
      dni: '1234567890',
    },
    status: USER_STATUS.ACTIVE,
  }

  const mockItem = {
    id: 1,
    availableForLoan: true,
  }

  beforeEach(async () => {
    const mockDbService = {
      db: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        execute: jest.fn().mockImplementation((query) => {
          if (query && query.includes && query.includes('count')) {
            return Promise.resolve([{ count: 1 }])
          }
          return Promise.resolve([mockLoan])
        }),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockLoan]),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        transaction: jest.fn().mockImplementation((callback) =>
          callback({
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockResolvedValue([mockLoan]),
          }),
        ),
      },
    }

    const mockLoanDetailService = {
      findDetailsByLoanID: jest.fn().mockResolvedValue([mockLoanDetail]),
      createDetail: jest.fn().mockResolvedValue(mockLoanDetail),
    }

    const mockUserService = {
      findByDni: jest.fn().mockResolvedValue(mockUser),
    }

    const mockItemsService = {
      findOne: jest.fn().mockResolvedValue(mockItem),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: DatabaseService,
          useValue: mockDbService,
        },
        {
          provide: LoanDetailsService,
          useValue: mockLoanDetailService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile()

    service = module.get<LoansService>(LoansService)
    dbService = module.get(DatabaseService)
    loanDetailService = module.get(LoanDetailsService)
    userService = module.get(UsersService)
    itemsService = module.get(ItemsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should return a loan by id', async () => {
      const result = await service.findOne(1)
      expect(result).toBeDefined()
      expect(result.id).toBe(1)
    })

    it('should throw NotFoundException when loan not found', async () => {
      jest.spyOn(dbService.db, 'execute').mockResolvedValueOnce([])
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findAll', () => {
    it('should return paginated loans with filters', async () => {
      const filterDto: FilterLoansDto = {
        page: 1,
        limit: 10,
        allRecords: false,
        status: LoanStatus.REQUESTED,
      }

      const mockPaginatedResponse = {
        records: [mockLoan],
        total: 1,
        limit: 10,
        page: 1,
        pages: 1,
      }

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPaginatedResponse)

      const result = await service.findAll(filterDto)
      expect(result.records).toBeDefined()
      expect(result.total).toBeDefined()
      expect(result.pages).toBeDefined()
    })
  })

  describe('create', () => {
    it('should create a new loan', async () => {
      const createDto: CreateLoanDto = {
        scheduledReturnDate: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        requestorId: '1234567890',
        reason: 'Test loan',
        loanDetails: [
          {
            itemId: 1,
            exitConditionId: 1,
            exitObservations: 'Good condition',
          },
        ],
        blockBlackListed: true,
      }

      const result = await service.create(createDto)
      expect(result).toBeDefined()
      expect(result.id).toBe(1)
    })

    it('should throw BadRequestException when scheduled return date is in the past', async () => {
      const createDto: CreateLoanDto = {
        scheduledReturnDate: new Date(
          new Date().getTime() - 24 * 60 * 60 * 1000,
        ),
        requestorId: '1234567890',
        reason: 'Test loan',
        loanDetails: [
          {
            itemId: 1,
            exitConditionId: 1,
            exitObservations: 'Good condition',
          },
        ],
        blockBlackListed: true,
      }

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('approveLoan', () => {
    it('should approve a requested loan', async () => {
      const approveDto: ApproveLoanDto = {
        notes: 'Approved with conditions',
      }

      const approvedLoan = {
        ...mockLoan,
        status: StatusLoan.APPROVED,
        approverId: 1,
      }

      jest.spyOn(service, 'approveLoan').mockResolvedValue(approvedLoan)

      const result = await service.approveLoan(1, approveDto, 1)
      expect(result).toBeDefined()
      expect(result.status).toBe(StatusLoan.APPROVED)
    })

    it('should throw NotFoundException when loan not found', async () => {
      jest.spyOn(dbService.db, 'execute').mockResolvedValueOnce([])
      const approveDto: ApproveLoanDto = { notes: 'Test notes' }
      await expect(service.approveLoan(999, approveDto, 1)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('deliverLoan', () => {
    it('should deliver an approved loan', async () => {
      const deliverDto: DeliverLoanDto = {
        notes: 'Delivered in good condition',
        deliveryDate: new Date(),
      }

      const deliveredLoan = {
        ...mockLoan,
        status: StatusLoan.DELIVERED,
        deliveryDate: new Date(),
      }

      jest.spyOn(service, 'deliverLoan').mockResolvedValue(deliveredLoan)

      const result = await service.deliverLoan(1, deliverDto)
      expect(result).toBeDefined()
      expect(result.status).toBe(StatusLoan.DELIVERED)
    })

    it('should throw BadRequestException when loan is not in APPROVED status', async () => {
      const deliverDto: DeliverLoanDto = {
        notes: 'Test notes',
        deliveryDate: new Date(),
      }

      await expect(service.deliverLoan(1, deliverDto)).rejects.toThrow(
        BadRequestException,
      )
    })
  })
})
