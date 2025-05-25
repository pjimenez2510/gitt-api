import { Test, TestingModule } from '@nestjs/testing'
import { LoansController } from '../loans.controller'
import { LoansService } from '../loans.service'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { CreateLoanDto } from '../dto/req/create-loan.dto'
import { FilterLoansDto } from '../dto/req/filter-loans.dto'
import { ApproveLoanDto } from '../dto/req/approve-loan.dto'
import { DeliverLoanDto } from '../dto/req/deliver-loan.dto'
import { SimpleUserResDto } from '../../auth/dto/res/simple-user-res.dto'
import { USER_TYPE } from '../../users/types/user-type.enum'
import { LoanStatus } from '../dto/req/filter-loans.dto'
import { plainToInstance } from 'class-transformer'
import { LoanResDto } from '../dto/res/loan-res.dto'
import { PassportModule } from '@nestjs/passport'

describe('LoansController', () => {
  let controller: LoansController
  let service: jest.Mocked<LoansService>
  let req: any

  // Mock del usuario autenticado
  const mockUser: SimpleUserResDto = {
    id: 1,
    username: 'manager1',
    userType: USER_TYPE.MANAGER,
    status: 'ACTIVE',
    career: 'Ingeniería de Sistemas',
    personId: 1,
  }

  // Mock de un préstamo basado en la estructura correcta del DTO
  const mockLoan = plainToInstance(LoanResDto, {
    id: 1,
    loanCode: 'PRESTAMO-001',
    requestDate: new Date(),
    approvalDate: new Date(),
    deliveryDate: new Date(),
    scheduledReturnDate: new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    ),
    actualReturnDate: new Date(),
    status: LoanStatus.REQUESTED,
    requestorId: 2,
    approverId: 1,
    reason: 'Préstamo para proyecto de clase',
    associatedEvent: 'Proyecto final',
    externalLocation: 'Campus principal',
    notes: 'Notas de prueba',
    responsibilityDocument: 'doc-12345.pdf',
    reminderSent: false,
    registrationDate: new Date(),
    updateDate: new Date(),
    loanDetails: [
      {
        id: 1,
        loanId: 1,
        itemId: 1,
        exitConditionId: 1,
        returnConditionId: 1,
        exitObservations: 'Buen estado',
        returnObservations: 'Devuelto en buen estado',
        registrationDate: new Date(),
        updateDate: new Date(),
      },
    ],
  })

  // Mock de la respuesta paginada
  const mockPaginatedResponse = {
    records: [mockLoan],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  }

  beforeEach(async () => {
    // Reiniciar el objeto req antes de cada test
    req = {
      action: '',
      logMessage: '',
    }

    // Crear los mocks para los métodos del servicio
    const mockLoansService = {
      findAll: jest.fn(),
      findActive: jest.fn(),
      findByUserDni: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      approveLoan: jest.fn(),
      deliverLoan: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [LoansController],
      providers: [
        {
          provide: LoansService,
          useValue: mockLoansService,
        },
      ],
    }).compile()

    controller = module.get<LoansController>(LoansController)
    service = module.get(LoansService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return a paginated list of loans with filters', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll')
      findAllSpy.mockResolvedValue(mockPaginatedResponse)

      const filterDto: FilterLoansDto = {
        page: 1,
        limit: 10,
        allRecords: false,
        status: LoanStatus.REQUESTED,
      }

      const result = await controller.findAll(req, filterDto)

      expect(result).toEqual(mockPaginatedResponse)
      expect(findAllSpy).toHaveBeenCalledWith(filterDto)
      expect(req.action).toEqual('loans:find-all:success')
      expect(req.logMessage).toContain(
        `Se obtuvieron ${mockPaginatedResponse.records.length} préstamos`,
      )
    })

    it('should handle errors in findAll method', async () => {
      const error = new Error('Test error')
      const findAllSpy = jest.spyOn(service, 'findAll')
      findAllSpy.mockRejectedValue(error)

      await expect(
        controller.findAll(req, { page: 1, limit: 10, allRecords: false }),
      ).rejects.toThrow(error)
      expect(req.action).toEqual('loans:find-all:failed')
      expect(req.logMessage).toContain('Error al obtener préstamos')
    })
  })

  describe('findActive', () => {
    it('should return a paginated list of active loans', async () => {
      const findActiveSpy = jest.spyOn(service, 'findActive')
      findActiveSpy.mockResolvedValue(mockPaginatedResponse)

      const paginationDto: BaseParamsDto = {
        page: 1,
        limit: 10,
        allRecords: false,
      }

      const result = await controller.findActive(req, paginationDto)

      expect(result).toEqual(mockPaginatedResponse)
      expect(findActiveSpy).toHaveBeenCalledWith(paginationDto)
      expect(req.action).toEqual('loans:find-active:success')
      expect(req.logMessage).toContain(
        `Se obtuvieron ${mockPaginatedResponse.records.length} préstamos activos`,
      )
    })

    it('should handle errors in findActive method', async () => {
      const error = new Error('Test error')
      const findActiveSpy = jest.spyOn(service, 'findActive')
      findActiveSpy.mockRejectedValue(error)

      await expect(
        controller.findActive(req, {
          page: 1,
          limit: 10,
          allRecords: false,
        }),
      ).rejects.toThrow(error)
      expect(req.action).toEqual('loans:find-active:failed')
      expect(req.logMessage).toContain('Error al obtener préstamos activos')
    })
  })

  describe('findByUserDni', () => {
    it('should return a paginated list of loans for a specific user by DNI', async () => {
      const findByUserDniSpy = jest.spyOn(service, 'findByUserDni')
      findByUserDniSpy.mockResolvedValue(mockPaginatedResponse)

      const dni = '1805271937'
      const paginationDto: BaseParamsDto = {
        page: 1,
        limit: 10,
        allRecords: false,
      }

      const result = await controller.findByUserDni(req, dni, paginationDto)

      expect(result).toEqual(mockPaginatedResponse)
      expect(findByUserDniSpy).toHaveBeenCalledWith(paginationDto, dni)
      expect(req.action).toEqual('loans:find-by-user-dni:success')
      expect(req.logMessage).toContain(
        `Se encontraron ${mockPaginatedResponse.records.length} préstamos para el DNI: ${dni}`,
      )
    })

    it('should handle errors in findByUserDni method', async () => {
      const error = new Error('Test error')
      const findByUserDniSpy = jest.spyOn(service, 'findByUserDni')
      findByUserDniSpy.mockRejectedValue(error)
      const dni = '1805271937'

      await expect(
        controller.findByUserDni(req, dni, {
          page: 1,
          limit: 10,
          allRecords: false,
        }),
      ).rejects.toThrow(error)
      expect(req.action).toEqual('loans:find-by-user-dni:failed')
      expect(req.logMessage).toContain(
        `Error al buscar historial de préstamos para DNI ${dni}`,
      )
    })
  })

  describe('findOne', () => {
    it('should return a loan by id', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne')
      findOneSpy.mockResolvedValue(mockLoan)

      const loanId = '1'

      const result = await controller.findOne(req, loanId)

      expect(result).toEqual(mockLoan)
      expect(findOneSpy).toHaveBeenCalledWith(+loanId)
      expect(req.action).toEqual('loans:find-one:success')
      expect(req.logMessage).toEqual(`Préstamo encontrado ID: ${loanId}`)
    })

    it('should handle errors in findOne method', async () => {
      const error = new Error('Test error')
      const findOneSpy = jest.spyOn(service, 'findOne')
      findOneSpy.mockRejectedValue(error)
      const loanId = '1'

      await expect(controller.findOne(req, loanId)).rejects.toThrow(error)
      expect(req.action).toEqual('loans:find-one:failed')
      expect(req.logMessage).toContain(`Error al buscar préstamo ID ${loanId}`)
    })
  })

  describe('create', () => {
    it('should create and return a new loan', async () => {
      const createSpy = jest.spyOn(service, 'create')
      createSpy.mockResolvedValue(mockLoan)

      const createDto: CreateLoanDto = {
        reason: 'Préstamo para proyecto de clase',
        associatedEvent: 'Proyecto final',
        externalLocation: 'Campus principal',
        scheduledReturnDate: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        requestorId: '1805271937',
        loanDetails: [
          {
            itemId: 1,
            exitConditionId: 1,
            exitObservations: 'Buen estado',
          },
        ],
        blockBlackListed: true,
      }

      const result = await controller.create(req, createDto, mockUser)

      expect(result).toEqual(mockLoan)
      expect(createSpy).toHaveBeenCalledWith(createDto)
      expect(req.action).toEqual('loans:create:success')
      expect(req.logMessage).toEqual(
        `Préstamo creado con ID: ${mockLoan.id} por el usuario ${mockUser.id}`,
      )
    })

    it('should handle errors in create method', async () => {
      const error = new Error('Test error')
      const createSpy = jest.spyOn(service, 'create')
      createSpy.mockRejectedValue(error)

      const createDto: CreateLoanDto = {
        reason: 'Préstamo para proyecto de clase',
        associatedEvent: 'Proyecto final',
        externalLocation: 'Campus principal',
        scheduledReturnDate: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        requestorId: '1805271937',
        loanDetails: [
          {
            itemId: 1,
            exitConditionId: 1,
            exitObservations: 'Buen estado',
          },
        ],
        blockBlackListed: true,
      }

      await expect(controller.create(req, createDto, mockUser)).rejects.toThrow(
        error,
      )
      expect(req.action).toEqual('loans:create:failed')
      expect(req.logMessage).toContain('Error al crear préstamo')
    })
  })

  describe('approveLoan', () => {
    it('should approve a requested loan', async () => {
      const approveLoanSpy = jest.spyOn(service, 'approveLoan')
      const approvedLoan = plainToInstance(LoanResDto, {
        ...mockLoan,
        status: LoanStatus.APPROVED,
        approvalDate: new Date(),
        approverId: mockUser.id,
      })
      approveLoanSpy.mockResolvedValue(approvedLoan)

      const loanId = '1'
      const approveDto: ApproveLoanDto = {
        notes: 'Aprobado con observaciones sobre el cuidado del equipo',
      }

      const result = await controller.approveLoan(
        req,
        loanId,
        approveDto,
        mockUser,
      )

      expect(result).toEqual(approvedLoan)
      expect(approveLoanSpy).toHaveBeenCalledWith(
        +loanId,
        approveDto,
        mockUser.id,
      )
      expect(req.action).toEqual('loans:approve:success')
      expect(req.logMessage).toEqual(
        `Préstamo aprobado ID: ${loanId} por el usuario ${mockUser.id}`,
      )
    })

    it('should handle errors in approveLoan method', async () => {
      const error = new Error('Test error')
      const approveLoanSpy = jest.spyOn(service, 'approveLoan')
      approveLoanSpy.mockRejectedValue(error)

      const loanId = '1'
      const approveDto: ApproveLoanDto = {
        notes: 'Aprobado con observaciones sobre el cuidado del equipo',
      }

      await expect(
        controller.approveLoan(req, loanId, approveDto, mockUser),
      ).rejects.toThrow(error)

      expect(req.action).toEqual('loans:approve:failed')
      expect(req.logMessage).toContain(`Error al aprobar préstamo ID ${loanId}`)
    })
  })

  describe('deliverLoan', () => {
    it('should register the delivery of an approved loan', async () => {
      const deliverLoanSpy = jest.spyOn(service, 'deliverLoan')
      const deliveredLoan = plainToInstance(LoanResDto, {
        ...mockLoan,
        status: LoanStatus.DELIVERED,
        deliveryDate: new Date(),
      })
      deliverLoanSpy.mockResolvedValue(deliveredLoan)

      const loanId = '1'
      const deliverDto: DeliverLoanDto = {
        notes: 'Entregado en perfecto estado',
        deliveryDate: new Date(),
      }

      const result = await controller.deliverLoan(
        req,
        loanId,
        deliverDto,
        mockUser,
      )

      expect(result).toEqual(deliveredLoan)
      expect(deliverLoanSpy).toHaveBeenCalledWith(+loanId, deliverDto)
      expect(req.action).toEqual('loans:deliver:success')
      expect(req.logMessage).toEqual(
        `Entrega de préstamo registrada ID: ${loanId} por el usuario ${mockUser.id}`,
      )
    })

    it('should handle errors in deliverLoan method', async () => {
      const error = new Error('Test error')
      const deliverLoanSpy = jest.spyOn(service, 'deliverLoan')
      deliverLoanSpy.mockRejectedValue(error)

      const loanId = '1'
      const deliverDto: DeliverLoanDto = {
        notes: 'Entregado en perfecto estado',
        deliveryDate: new Date(),
      }

      await expect(
        controller.deliverLoan(req, loanId, deliverDto, mockUser),
      ).rejects.toThrow(error)

      expect(req.action).toEqual('loans:deliver:failed')
      expect(req.logMessage).toContain(
        `Error al registrar entrega de préstamo ID ${loanId}`,
      )
    })
  })
})
