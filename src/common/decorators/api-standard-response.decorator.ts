import { HttpStatus, applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { ApiPaginatedRes, ApiRes } from '../types/api-response.interface'

export function ApiStandardResponse<T>(
  model?: Type<T> | string,
  status: HttpStatus = HttpStatus.OK,
) {
  return applyDecorators(
    ApiExtraModels(
      model ? ApiRes : ApiRes<T>,
      ...(typeof model === 'function' ? [model] : []),
    ),
    ApiResponse({
      status,
      description: getStatusDescription(status),
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiRes) },
          ...(model
            ? [
                {
                  properties: {
                    data: { $ref: getSchemaPath(model) },
                  },
                },
              ]
            : []),
        ],
      },
    }),
  )
}

export function ApiPaginatedResponse<T>(
  model: Type<T>,
  status: HttpStatus = HttpStatus.OK,
) {
  return applyDecorators(
    ApiExtraModels(ApiRes, ApiPaginatedRes, model),
    ApiResponse({
      status,
      description: getStatusDescription(status),
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiRes) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(ApiPaginatedRes) },
                  {
                    properties: {
                      records: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  )
}

// Función auxiliar para descripciones de estado
function getStatusDescription(status: HttpStatus): string {
  const descriptions = {
    [HttpStatus.OK]: 'Successful operation',
    [HttpStatus.CREATED]: 'Resource created successfully',
    [HttpStatus.ACCEPTED]: 'Request accepted for processing',
    [HttpStatus.NO_CONTENT]: 'Request successful but no content to return',
    // Agrega más según necesites
  }
  return descriptions[status] || `Status code ${status}`
}
