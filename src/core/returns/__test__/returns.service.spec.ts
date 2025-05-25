import { Test, TestingModule } from '@nestjs/testing'
import { ReturnService } from '../returns.service'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateReturnLoanDto } from '../dto/req/create-return.dto'
import { SimpleUserResDto } from '../../auth/dto/res/simple-user-res.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { StatusLoan } from '../../loans/enums/status-loan'
import { USER_STATUS } from '../../users/types/user-status.enum'
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock'

describe('ReturnService', () => {
  let service: ReturnService
  let dbService: typeof mockDatabaseService

  const mockUser: SimpleUserResDto = {
    id: 1,
    username: 'testuser',
    userType: 'ADMINISTRATOR',
    status: 'ACTIVE',
    career: 'Test Career',
    personId: 1,
  }

  const mockCreateReturnDto: CreateReturnLoanDto = {
    loanId: 1,
    actualReturnDate: '2024-03-19T10:00:00Z',
    returnedItems: [
      {
        loanDetailId: 1,
        returnConditionId: 1,
        returnObservations: 'Test observation',
      },
    ],
    notes: 'Test return notes',
  }

  const mockLoan = {
    id: 1,
    status: StatusLoan.DELIVERED,
    deliveryDate: new Date('2024-03-18T10:00:00Z'),
    scheduledReturnDate: new Date('2024-03-20T10:00:00Z'),
    requestorId: 1,
    notes: 'Original notes',
  }

  const mockLoanDetails = [
    {
      id: 1,
      loanId: 1,
      itemId: 1,
      exitConditionId: 1,
    },
  ]

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile()

    service = module.get<ReturnService>(ReturnService)
    dbService = mockDatabaseService
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('processReturn', () => {
    it('should process a return successfully when returned on time', async () => {
      // Mock the loan query
      dbService.db.execute
        .mockResolvedValueOnce([mockLoan])
        .mockResolvedValueOnce(mockLoanDetails)

      // Mock the transaction updates
      const transactionMock = jest.fn().mockImplementation(async (callback) => {
        await callback(dbService.db)
        return {
          loanId: 1,
          status: StatusLoan.RETURNED,
          message: 'Préstamo devuelto a tiempo',
          isLate: false,
          returnDate: expect.any(Date),
        }
      })
      dbService.transaction = transactionMock

      const result = await service.processReturn(mockCreateReturnDto, mockUser)

      expect(result).toEqual({
        loanId: 1,
        status: StatusLoan.RETURNED,
        message: 'Préstamo devuelto a tiempo',
        isLate: false,
        returnDate: expect.any(Date),
      })

      // Verify transaction was called
      expect(transactionMock).toHaveBeenCalled()
    })

    it('should throw NotFoundException when loan does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([])

      await expect(
        service.processReturn(mockCreateReturnDto, mockUser),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw BadRequestException when loan is not in DELIVERED status', async () => {
      dbService.db.execute.mockResolvedValueOnce([
        { ...mockLoan, status: StatusLoan.RETURNED },
      ])

      await expect(
        service.processReturn(mockCreateReturnDto, mockUser),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException when return date is before delivery date', async () => {
      dbService.db.execute.mockResolvedValueOnce([
        {
          ...mockLoan,
          deliveryDate: new Date('2024-03-20T10:00:00Z'),
        },
      ])

      await expect(
        service.processReturn(mockCreateReturnDto, mockUser),
      ).rejects.toThrow(BadRequestException)
    })

    it('should mark user as defaulter when return is late', async () => {
      const lateLoan = {
        ...mockLoan,
        scheduledReturnDate: new Date('2024-03-18T10:00:00Z'),
      }

      // Mock the loan query
      dbService.db.execute
        .mockResolvedValueOnce([lateLoan])
        .mockResolvedValueOnce(mockLoanDetails)

      // Mock the transaction updates
      const transactionMock = jest.fn().mockImplementation(async (callback) => {
        await callback(dbService.db)
        return {
          loanId: 1,
          status: StatusLoan.RETURNED_LATE,
          message: 'Préstamo devuelto con retraso',
          isLate: true,
          returnDate: expect.any(Date),
        }
      })
      dbService.transaction = transactionMock

      const result = await service.processReturn(mockCreateReturnDto, mockUser)

      expect(result).toEqual({
        loanId: 1,
        status: StatusLoan.RETURNED_LATE,
        message: 'Préstamo devuelto con retraso',
        isLate: true,
        returnDate: expect.any(Date),
      })

      // Verify transaction was called
      expect(transactionMock).toHaveBeenCalled()

      // Verify user was marked as defaulter
      expect(dbService.db.update).toHaveBeenCalled()
      expect(dbService.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          status: USER_STATUS.DEFAULTER,
        }),
      )
    })
  })

  describe('getLoanForReturn', () => {
    it('should get loan information successfully', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockLoan])

      const result = await service.getLoanForReturn(1)

      expect(result).toEqual(mockLoan)
    })

    it('should throw NotFoundException when loan does not exist', async () => {
      dbService.db.execute.mockResolvedValueOnce([])

      await expect(service.getLoanForReturn(1)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw BadRequestException when loan is not in DELIVERED status', async () => {
      dbService.db.execute.mockResolvedValueOnce([
        { ...mockLoan, status: StatusLoan.RETURNED },
      ])

      await expect(service.getLoanForReturn(1)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('getActiveLoans', () => {
    it('should get all active loans when no userId is provided', async () => {
      const mockActiveLoans = [mockLoan]
      dbService.db.execute.mockResolvedValueOnce(mockActiveLoans)

      const result = await service.getActiveLoans()

      expect(result).toEqual(mockActiveLoans)
      expect(dbService.db.where).toHaveBeenCalled()
    })

    it('should get active loans for specific user when userId is provided', async () => {
      const mockActiveLoans = [mockLoan]
      dbService.db.execute.mockResolvedValueOnce(mockActiveLoans)

      const result = await service.getActiveLoans(1)

      expect(result).toEqual(mockActiveLoans)
      expect(dbService.db.where).toHaveBeenCalled()
    })
  })

  describe('getOverdueLoans', () => {
    it('should get overdue loans successfully', async () => {
      const mockOverdueLoans = [
        {
          ...mockLoan,
          scheduledReturnDate: new Date('2024-03-18T10:00:00Z'),
        },
      ]
      dbService.db.execute.mockResolvedValueOnce(mockOverdueLoans)

      const result = await service.getOverdueLoans()

      expect(result).toEqual(mockOverdueLoans)
      expect(dbService.db.where).toHaveBeenCalled()
    })
  })
})
