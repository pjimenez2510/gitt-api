import { Test, TestingModule } from '@nestjs/testing'
import { ItemMaterialsService } from '../item-materials.service'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemMaterialDto } from '../dto/req/create-item-material.dto'
import { UpdateItemMaterialDto } from '../dto/req/update-item-material.dto'
import { NotFoundException } from '@nestjs/common'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { plainToInstance } from 'class-transformer'
import { ItemMaterialResDto } from '../dto/res/item-material-res.dto'
import { FilterItemMaterialDto } from '../dto/req/item-material-filter.dto'

describe('ItemMaterialsService', () => {
  let service: ItemMaterialsService
  let dbService: jest.Mocked<DatabaseService>

  const mockItemMaterial = plainToInstance(ItemMaterialResDto, {
    id: 1,
    itemId: 1,
    materialId: 2,
    isMainMaterial: true,
    material: {
      id: 2,
      name: 'Test Material',
      description: 'Test Description',
      materialType: 'Test Type',
    },
  })

  const mockDatabaseService = {
    db: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      query: {
        itemMaterial: {
          findMany: jest
            .fn()
            .mockImplementation(() => Promise.resolve([mockItemMaterial])),
          findFirst: jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockItemMaterial)),
        },
      },
    },
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemMaterialsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile()

    service = module.get<ItemMaterialsService>(ItemMaterialsService)
    dbService = module.get(DatabaseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return a paginated list of item materials with filters', async () => {
      const filterDto: FilterItemMaterialDto = {
        page: 1,
        limit: 10,
        allRecords: false,
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      }

      mockDatabaseService.db.execute.mockResolvedValueOnce([{ count: 1 }])

      const result = await service.findAll(filterDto)

      expect(result).toEqual({
        records: [mockItemMaterial],
        total: 1,
        limit: 10,
        page: 1,
        pages: 1,
      })
    })

    it('should return all records when allRecords is true', async () => {
      const filterDto: FilterItemMaterialDto = {
        page: 1,
        limit: 10,
        allRecords: true,
      }

      mockDatabaseService.db.execute.mockResolvedValueOnce([{ count: 1 }])

      const result = await service.findAll(filterDto)

      expect(result).toEqual({
        records: [mockItemMaterial],
        total: 1,
        limit: 1,
        page: 1,
        pages: 1,
      })
    })
  })

  describe('findOne', () => {
    it('should return an item material when found', async () => {
      const result = await service.findOne(1)
      expect(result).toEqual(mockItemMaterial)
    })

    it('should throw NotFoundException when item material not found', async () => {
      mockDatabaseService.db.query.itemMaterial.findFirst.mockResolvedValueOnce(
        null,
      )
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create and return a new item material', async () => {
      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      }

      mockDatabaseService.db.query.itemMaterial.findFirst.mockResolvedValueOnce(
        null,
      )
      mockDatabaseService.db.execute.mockResolvedValueOnce([{ id: 1 }])

      const result = await service.create(createDto)

      expect(result).toEqual(mockItemMaterial)
      expect(mockDatabaseService.db.insert).toHaveBeenCalled()
      expect(mockDatabaseService.db.values).toHaveBeenCalled()
      expect(mockDatabaseService.db.returning).toHaveBeenCalled()
    })

    it('should throw DisplayableException if item-material combination already exists', async () => {
      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      }

      mockDatabaseService.db.query.itemMaterial.findFirst.mockResolvedValueOnce(
        mockItemMaterial,
      )

      await expect(service.create(createDto)).rejects.toThrow(
        DisplayableException,
      )
    })
  })

  describe('update', () => {
    it('should update and return an item material', async () => {
      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      }

      // Mock existById
      mockDatabaseService.db.execute.mockResolvedValueOnce([{ id: 1 }])

      // Create the updated mock that will be returned by the database
      const updatedMockItemMaterial = plainToInstance(ItemMaterialResDto, {
        id: 1,
        itemId: 1,
        materialId: 2,
        isMainMaterial: false,
        material: {
          id: 2,
          name: 'Test Material',
          description: 'Test Description',
          materialType: 'Test Type',
        },
      })

      // Reset findFirst mock implementation
      mockDatabaseService.db.query.itemMaterial.findFirst
        .mockReset()
        .mockImplementation((args) => {
          // For the first call (existById) return the original mock
          if (!args?.where) {
            return Promise.resolve(mockItemMaterial)
          }
          // For the second call (after update) return the updated mock
          return Promise.resolve(updatedMockItemMaterial)
        })

      // Mock the update operation
      mockDatabaseService.db.execute.mockResolvedValueOnce([{ id: 1 }])

      const result = await service.update(1, updateDto)

      expect(result).toEqual(updatedMockItemMaterial)
      expect(mockDatabaseService.db.update).toHaveBeenCalled()
      expect(mockDatabaseService.db.set).toHaveBeenCalledWith(updateDto)
    })

    it('should throw NotFoundException if item material does not exist', async () => {
      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      }

      mockDatabaseService.db.execute.mockResolvedValueOnce([])

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw DisplayableException if updating to an existing material combination', async () => {
      const updateDto: UpdateItemMaterialDto = {
        materialId: 3,
      }

      // Mock existById
      mockDatabaseService.db.execute.mockResolvedValueOnce([{ id: 1 }])

      // Mock findOne for current record
      mockDatabaseService.db.query.itemMaterial.findFirst
        .mockResolvedValueOnce(mockItemMaterial) // For existById
        .mockResolvedValueOnce(mockItemMaterial) // For getting current record
        .mockResolvedValueOnce({ id: 2 }) // For checking existing combination

      await expect(service.update(1, updateDto)).rejects.toThrow(
        DisplayableException,
      )
    })
  })

  describe('remove', () => {
    it('should remove an item material and return true', async () => {
      mockDatabaseService.db.execute
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([{ active: false }])

      const result = await service.remove(1)

      expect(result).toBe(true)
      expect(mockDatabaseService.db.update).toHaveBeenCalled()
      expect(mockDatabaseService.db.set).toHaveBeenCalled()
    })

    it('should throw NotFoundException if item material does not exist', async () => {
      mockDatabaseService.db.execute.mockResolvedValueOnce([])

      await expect(service.remove(999)).rejects.toThrow(NotFoundException)
    })
  })
})
