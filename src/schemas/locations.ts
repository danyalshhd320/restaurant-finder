export const errorResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          field: { type: 'string' },
        },
        required: ['message', 'field'],
      },
    },
  },
};

export const locationParamsSchema = {
  type: 'object',
  required: ['locationId'],
  properties: {
    locationId: { type: 'string', format: 'uuid' },
  },
};

export const locationStoreSchema = {
  type: 'object',
  required: ['name', 'type', 'image', 'coordinates', 'radius'],
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
    openingHours: { type: 'string' },
    'opening-hours': { type: 'string' },
    image: { type: 'string', format: 'uri' },
    coordinates: { type: 'string', pattern: '^x=\\d+,y=\\d+$' },
    radius: { type: 'integer', minimum: 1 },
  },
  anyOf: [
    { required: ['openingHours'] },
    { required: ['opening-hours'] },
  ],
};

export const locationDetailSchema = {
  type: 'object',
  required: ['id', 'name', 'type', 'opening-hours', 'image', 'coordinates'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    type: { type: 'string' },
    'opening-hours': { type: 'string' },
    image: { type: 'string', format: 'uri' },
    coordinates: { type: 'string', pattern: '^x=\\d+,y=\\d+$' },
  },
};

export const locationSearchQuerySchema = {
  type: 'object',
  required: ['x', 'y'],
  properties: {
    x: { type: 'string', pattern: '^\\d+(\\.\\d+)?$' },
    y: { type: 'string', pattern: '^\\d+(\\.\\d+)?$' },
  },
};

export const locationSearchResultSchema = {
  type: 'object',
  required: ['id', 'name', 'coordinates', 'distance'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    coordinates: { type: 'string', pattern: '^x=\\d+,y=\\d+$' },
    distance: { type: 'number' },
  },
};

export const locationSearchResponseSchema = {
  type: 'object',
  required: ['user-location', 'locations'],
  properties: {
    'user-location': { type: 'string', pattern: '^x=\\d+,y=\\d+$' },
    locations: { type: 'array', items: locationSearchResultSchema },
  },
};
