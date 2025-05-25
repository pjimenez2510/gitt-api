import { Test, TestingModule } from '@nestjs/testing'
import { LoanDetailsService } from '../loan-details.service'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateLoanDetailDto } from '../dto/req/create-loan-detail.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { mockDatabaseService } from 'src/common/__mocks__/database.service.mock'
import { plainToInstance } from 'class-transformer'
import { LoanDetailResDto } from '../dto/res/loan-detail-res.dto'

describe('LoanDetailsService', () => {
  let service: LoanDetailsService
  let dbService: typeof mockDatabaseService

  const mockLoanDetail = plainToInstance(LoanDetailResDto, {
    id: 1,
    loanId: 1,
    itemId: 1,
    exitConditionId: 1,
    returnConditionId: null,
    exitObservations: 'Test observation',
    returnObservations: null,
    registrationDate: new Date(),
    updateDate: new Date(),
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanDetailsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile()

    service = module.get<LoanDetailsService>(LoanDetailsService)
    dbService = mockDatabaseService
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findByLoanID', () => {
    it('should return loan details with pagination', async () => {
      const mockResult = {
        records: [mockLoanDetail],
        total: 1,
        limit: 10,
        page: 1,
        pages: 1,
      }

      dbService.db.execute
        .mockResolvedValueOnce([mockLoanDetail])
        .mockResolvedValueOnce([{ count: 1 }])

      const params: BaseParamsDto = { page: 1, limit: 10, allRecords: false }
      const result = await service.findByLoanID(params, 1)
      expect(result).toEqual(mockResult)
    })
  })

  describe('findDetailsByLoanID', () => {
    it('should return all loan details for a loan', async () => {
      dbService.db.execute.mockResolvedValueOnce([mockLoanDetail])

      const result = await service.findDetailsByLoanID(1)
      expect(result).toEqual([mockLoanDetail])
    })
  })

  describe('createDetail', () => {
    it('should create a new loan detail', async () => {
      const mockDetail: CreateLoanDetailDto = {
        itemId: 1,
        exitConditionId: 1,
        exitObservations: 'Test observation',
      }

      // Mock the database response
      const mockDbResponse = [
        {
          id: 1,
          loanId: 1,
          itemId: 1,
          exitConditionId: 1,
          exitObservations: 'Test observation',
          returnConditionId: null,
          returnObservations: null,
          registrationDate: new Date(),
          updateDate: new Date(),
        },
      ]

      // Mock the chain
      dbService.db.insert.mockReturnThis()
      dbService.db.values.mockReturnThis()
      dbService.db.returning.mockReturnThis()
      dbService.db.execute.mockResolvedValueOnce(mockDbResponse)

      const result = await service.createDetail(1, mockDetail)
      expect(result).toEqual(mockLoanDetail)

      // Verify the insert was called with correct parameters
      expect(dbService.db.insert).toHaveBeenCalled()
      expect(dbService.db.values).toHaveBeenCalledWith({
        loanId: 1,
        itemId: mockDetail.itemId,
        exitConditionId: mockDetail.exitConditionId,
        exitObservations: mockDetail.exitObservations,
      })
    })
  })
})
