import { authSchema } from './header-auth-schema.mjs'

const addPromoterSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['promoterName'],
    properties: {
      promoterName: {
        type: 'string'
      },
      promoterUrl: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
}

const discardPromoterSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
}

const readAllPromotersSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['_id', 'promoterName', 'creatorId', 'ownerId'],
            properties: {
              _id: { type: 'string' },
              promoterName: { type: 'string' },
              promoterUrl: { type: 'string' },
              creatorId: { type: 'string' },
              ownerId: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        type: { type: 'string' },
        message: { type: 'string' },
        validationResults: { type: 'array' }
      }
    },
    404: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        type: { type: 'string' },
        message: { type: 'string' }
      }
    },
    503: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        type: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

const readPromoterByIdSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['_id', 'promoterName', 'creatorId', 'ownerId'],
            properties: {
              _id: { type: 'string' },
              promoterName: { type: 'string' },
              promoterUrl: { type: 'string' },
              creatorId: { type: 'string' },
              ownerId: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        }
      }
    }
  }
}

export { addPromoterSchema, discardPromoterSchema, readAllPromotersSchema, readPromoterByIdSchema }
