import { Test, TestingModule } from '@nestjs/testing'
import { ReturnController } from '../returns.controller'
import { ReturnService } from '../returns.service'
import { CreateReturnLoanDto } from '../dto/req/create-return.dto'
import { SimpleUserResDto } from '../../auth/dto/res/simple-user-res.dto'
import { Request } from 'express'

describe('ReturnController', () => {
  let controller: ReturnController
  let service: ReturnService

  const mockReturnService = {
    processReturn: jest.fn(),
    getLoanForReturn: jest.fn(),
    getActiveLoans: jest.fn(),
    getOverdueLoans: jest.fn(),
  }

  const mockRequest = {
    action: '',
    logMessage: '',
  } as Request

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

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnController],
      providers: [
        {
          provide: ReturnService,
          useValue: mockReturnService,
        },
      ],
    }).compile()

    controller = module.get<ReturnController>(ReturnController)
    service = module.get<ReturnService>(ReturnService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('processReturn', () => {
    const executeTest = async () => {
      return await controller.processReturn(
        mockRequest,
        mockCreateReturnDto,
        mockUser,
      )
    }

    it('should process a return successfully', async () => {
      const expectedResult = {
        loanId: 1,
        status: 'RETURNED',
        message: 'Préstamo devuelto a tiempo',
        isLate: false,
        returnDate: new Date(),
      }

      mockReturnService.processReturn.mockResolvedValueOnce(expectedResult)

      const result = await executeTest()

      expect(result).toEqual(expectedResult)
      expect(mockReturnService.processReturn).toHaveBeenCalledWith(
        mockCreateReturnDto,
        mockUser,
      )
    })

    it('should throw an error if user is not provided', async () => {
      await expect(
        controller.processReturn(
          mockRequest,
          mockCreateReturnDto,
          undefined as unknown as SimpleUserResDto,
        ),
      ).rejects.toThrow(
        'No se encontró información del usuario en la solicitud',
      )
    })
  })

  describe('getLoanForReturn', () => {
    const executeTest = async () => {
      return await controller.getLoanForReturn(mockRequest, 1)
    }

    it('should get loan information successfully', async () => {
      const expectedResult = {
        id: 1,
        status: 'DELIVERED',
        // ... other loan properties
      }

      mockReturnService.getLoanForReturn.mockResolvedValueOnce(expectedResult)

      const result = await executeTest()

      expect(result).toEqual(expectedResult)
      expect(mockReturnService.getLoanForReturn).toHaveBeenCalledWith(1)
    })
  })

  describe('getActiveLoans', () => {
    const executeTest = async () => {
      return await controller.getActiveLoans(mockRequest)
    }

    it('should get active loans successfully', async () => {
      const expectedResult = [
        {
          id: 1,
          status: 'DELIVERED',
          // ... other loan properties
        },
      ]

      mockReturnService.getActiveLoans.mockResolvedValueOnce(expectedResult)

      const result = await executeTest()

      expect(result).toEqual(expectedResult)
      expect(mockReturnService.getActiveLoans).toHaveBeenCalled()
    })
  })

  describe('getActiveUserLoans', () => {
    const executeTest = async () => {
      return await controller.getActiveUserLoans(mockRequest, 1)
    }

    it('should get active loans for a specific user successfully', async () => {
      const expectedResult = [
        {
          id: 1,
          status: 'DELIVERED',
          requestorId: 1,
          // ... other loan properties
        },
      ]

      mockReturnService.getActiveLoans.mockResolvedValueOnce(expectedResult)

      const result = await executeTest()

      expect(result).toEqual(expectedResult)
      expect(mockReturnService.getActiveLoans).toHaveBeenCalledWith(1)
    })
  })

  describe('getOverdueLoans', () => {
    const executeTest = async () => {
      return await controller.getOverdueLoans(mockRequest)
    }

    it('should get overdue loans successfully', async () => {
      const expectedResult = [
        {
          id: 1,
          status: 'DELIVERED',
          scheduledReturnDate: '2024-03-18T10:00:00Z',
          // ... other loan properties
        },
      ]

      mockReturnService.getOverdueLoans.mockResolvedValueOnce(expectedResult)

      const result = await executeTest()

      expect(result).toEqual(expectedResult)
      expect(mockReturnService.getOverdueLoans).toHaveBeenCalled()
    })
  })
})
