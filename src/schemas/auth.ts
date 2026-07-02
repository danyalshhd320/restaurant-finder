export const authTokenSchema = {
  body: {
    type: 'object',
    required: ['username', 'password', 'role'],
    properties: {
      username: { type: 'string', minLength: 1 },
      password: { type: 'string', minLength: 1 },
      role: { type: 'string', enum: ['admin', 'user'] },
    },
  },
  response: {
    200: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
