import { authSchema } from './header-auth-schema.mjs'

const addUserSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: ['emailAddress', 'firstName', 'lastName', 'plaintextPassword', 'role', 'username'],
    properties: {
      emailAddress: {
        type: 'string'
      },
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      plaintextPassword: {
        type: 'string'
      },
      role: {
        type: 'string'
      },
      username: {
        type: 'string'
      },
      createdBy: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
}

const addUserGuestSchema = {
  body: {
    type: 'object',
    required: ['emailAddress', 'firstName', 'lastName', 'plaintextPassword', 'username'],
    properties: {
      emailAddress: {
        type: 'string'
      },
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      plaintextPassword: {
        type: 'string'
      },
      username: {
        type: 'string'
      },
      createdBy: {
        type: 'string'
      }
    },
    additionalProperties: false
  }
}

const readAllUsersSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['_id', 'role'],
            properties: {
              _id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              role: { type: 'string' },
              username: { type: 'string' },
              createdBy: { type: 'string' }
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

export { addUserSchema, addUserGuestSchema, readAllUsersSchema }
