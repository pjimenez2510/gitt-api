/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing'
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { ItemImagesController } from '../item-images.controller'
import { ItemImagesService } from '../item-images.service'

describe('ItemImagesController', () => {
  let controller: ItemImagesController

  const mockItemImagesService = {
    create: jest.fn(),
  }

  const mockRequest = {
    action: '',
    logMessage: '',
  }

  const mockFile = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test'),
    destination: 'uploads',
    filename: 'test.jpg',
    path: 'uploads/test.jpg',
    stream: null,
  }

  const mockBody = {
    itemId: 1,
    type: 'PRIMARY',
    isPrimary: true,
    description: 'Test description',
    photoDate: '2023-01-01',
  }

  const mockResponse = {
    id: 1,
    itemId: 1,
    filePath: 'uploads/test.jpg',
    type: 'PRIMARY',
    isPrimary: true,
    description: 'Test description',
    photoDate: '2023-01-01',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemImagesController],
      providers: [
        {
          provide: ItemImagesService,
          useValue: mockItemImagesService,
        },
      ],
    }).compile()

    controller = module.get<ItemImagesController>(ItemImagesController)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      mockItemImagesService.create.mockResolvedValue(mockResponse)

      const result = await controller.uploadFile(
        mockRequest as any,
        mockFile as any,
        mockBody,
      )

      expect(result).toEqual(mockResponse)
      expect(mockItemImagesService.create).toHaveBeenCalled()
      expect(mockRequest.action).toBe('item-images:upload-file:success')
    })

    it('should throw error when no file provided', async () => {
      await expect(
        controller.uploadFile(mockRequest as any, null as any, mockBody),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw error when file is empty', async () => {
      const emptyFile = { ...mockFile, buffer: null, size: 0 }

      await expect(
        controller.uploadFile(
          mockRequest as any,
          emptyFile as any,
          mockBody,
        ),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw error when file has no path', async () => {
      const fileNoPath = { ...mockFile, path: undefined }

      await expect(
        controller.uploadFile(
          mockRequest as any,
          fileNoPath as any,
          mockBody,
        ),
      ).rejects.toThrow(InternalServerErrorException)
    })

    it('should set current date when photoDate is empty', async () => {
      const bodyEmptyDate = { ...mockBody, photoDate: '' }
      mockItemImagesService.create.mockResolvedValue(mockResponse)

      await controller.uploadFile(
        mockRequest as any,
        mockFile as any,
        bodyEmptyDate,
      )

      const callArgs = mockItemImagesService.create.mock.calls[0][0]
      expect(callArgs.photoDate).toBeDefined()
      expect(typeof callArgs.photoDate).toBe('string')
    })

    it('should handle service errors', async () => {
      const error = new Error('Service error')
      mockItemImagesService.create.mockRejectedValue(error)

      await expect(
        controller.uploadFile(
          mockRequest as any,
          mockFile as any,
          mockBody,
        ),
      ).rejects.toThrow(error)

      expect(mockRequest.action).toBe('item-types:create:failed')
    })
  })
})