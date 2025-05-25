import { Test, TestingModule } from '@nestjs/testing'
import { ItemMaterialsController } from '../item-materials.controller'
import { ItemMaterialsService } from '../item-materials.service'
import { CreateItemMaterialDto } from '../dto/req/create-item-material.dto'
import { UpdateItemMaterialDto } from '../dto/req/update-item-material.dto'
import { FilterItemMaterialDto } from '../dto/req/item-material-filter.dto'
import { Request } from 'express'

describe('ItemMaterialsController', () => {
  let controller: ItemMaterialsController
  let service: jest.Mocked<ItemMaterialsService>

  const mockItemMaterial = {
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
  }

  const mockPaginatedResponse = {
    records: [mockItemMaterial],
    total: 1,
    limit: 10,
    page: 1,
    pages: 1,
  }

  const mockRequest = {
    action: '',
    logMessage: '',
  } as Request

  beforeEach(async () => {
    const mockItemMaterialsService = {
      findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
      findOne: jest.fn().mockResolvedValue(mockItemMaterial),
      create: jest.fn().mockResolvedValue(mockItemMaterial),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockItemMaterial, isMainMaterial: false }),
      remove: jest.fn().mockResolvedValue(true),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemMaterialsController],
      providers: [
        {
          provide: ItemMaterialsService,
          useValue: mockItemMaterialsService,
        },
      ],
    }).compile()

    controller = module.get<ItemMaterialsController>(ItemMaterialsController)
    service = module.get(ItemMaterialsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAllWithFilters', () => {
    it('should return a paginated list of item materials with filters', async () => {
      const filterDto: FilterItemMaterialDto = {
        page: 1,
        limit: 10,
        allRecords: false,
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      }

      const result = await controller.findAllWithFilters(mockRequest, filterDto)

      expect(result).toEqual(mockPaginatedResponse)
      const findAllSpy = jest.spyOn(service, 'findAll')
      expect(findAllSpy).toHaveBeenCalledWith(filterDto)
      expect(mockRequest.action).toBe('item-materials:find-all-filters:success')
    })

    it('should handle errors when finding all materials', async () => {
      const filterDto: FilterItemMaterialDto = {
        page: 1,
        limit: 10,
        allRecords: false,
      }
      const error = new Error('Test error')
      service.findAll.mockRejectedValue(error)

      await expect(
        controller.findAllWithFilters(mockRequest, filterDto),
      ).rejects.toThrow(error)
      expect(mockRequest.action).toBe('item-materials:find-all-filters:failed')
    })
  })

  describe('findOne', () => {
    it('should return a single item material by id', async () => {
      const itemMaterialId = 1

      const result = await controller.findOne(mockRequest, itemMaterialId)

      expect(result).toEqual(mockItemMaterial)
      const findOneSpy = jest.spyOn(service, 'findOne')
      expect(findOneSpy).toHaveBeenCalledWith(itemMaterialId)
      expect(mockRequest.action).toBe('item-materials:find-one:success')
    })

    it('should handle errors when finding one material', async () => {
      const error = new Error('Test error')
      service.findOne.mockRejectedValue(error)

      await expect(controller.findOne(mockRequest, 1)).rejects.toThrow(error)
      expect(mockRequest.action).toBe('item-materials:find-one:failed')
    })
  })

  describe('create', () => {
    it('should create and return a new item material', async () => {
      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      }

      const result = await controller.create(mockRequest, createDto)

      expect(result).toEqual(mockItemMaterial)
      const createSpy = jest.spyOn(service, 'create')
      expect(createSpy).toHaveBeenCalledWith(createDto)
      expect(mockRequest.action).toBe('item-materials:create:success')
    })

    it('should handle errors when creating a material', async () => {
      const createDto: CreateItemMaterialDto = {
        itemId: 1,
        materialId: 2,
        isMainMaterial: true,
      }
      const error = new Error('Test error')
      service.create.mockRejectedValue(error)

      await expect(controller.create(mockRequest, createDto)).rejects.toThrow(
        error,
      )
      expect(mockRequest.action).toBe('item-materials:create:failed')
    })
  })

  describe('update', () => {
    it('should update and return an item material', async () => {
      const itemMaterialId = 1
      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      }

      const result = await controller.update(
        mockRequest,
        itemMaterialId,
        updateDto,
      )

      expect(result).toEqual({ ...mockItemMaterial, isMainMaterial: false })
      const updateSpy = jest.spyOn(service, 'update')
      expect(updateSpy).toHaveBeenCalledWith(itemMaterialId, updateDto)
      expect(mockRequest.action).toBe('item-materials:update:success')
    })

    it('should handle errors when updating a material', async () => {
      const updateDto: UpdateItemMaterialDto = {
        isMainMaterial: false,
      }
      const error = new Error('Test error')
      service.update.mockRejectedValue(error)

      await expect(
        controller.update(mockRequest, 1, updateDto),
      ).rejects.toThrow(error)
      expect(mockRequest.action).toBe('item-materials:update:failed')
    })
  })

  describe('remove', () => {
    it('should remove an item material and return true', async () => {
      const itemMaterialId = 1

      const result = await controller.remove(mockRequest, itemMaterialId)

      expect(result).toBe(true)
      const removeSpy = jest.spyOn(service, 'remove')
      expect(removeSpy).toHaveBeenCalledWith(itemMaterialId)
      expect(mockRequest.action).toBe('item-materials:remove:success')
    })

    it('should handle errors when removing a material', async () => {
      const error = new Error('Test error')
      service.remove.mockRejectedValue(error)

      await expect(controller.remove(mockRequest, 1)).rejects.toThrow(error)
      expect(mockRequest.action).toBe('item-materials:remove:failed')
    })
  })
})
