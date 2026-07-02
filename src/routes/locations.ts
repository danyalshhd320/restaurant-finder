import { FastifyPluginAsync } from 'fastify';
import {
  LocationParams,
  LocationSearchQuery,
  LocationStoreQuery,
} from '../interfaces/routes';
import {
  getLocationById,
  getNearbyLocations,
  updateLocationById,
  createRandomLocations,
} from '../services/locations';
import { parseCoordinates } from '../utils';
import {
  errorResponseSchema,
  locationDetailSchema,
  locationParamsSchema,
  locationSearchQuerySchema,
  locationSearchResponseSchema,
  locationStoreSchema,
} from '../schemas/locations';
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
} from '../constants/statusCodes';
import { RESPONSE_MESSAGES } from '../constants/responses';
import { messageResponse } from '../utils';

const locationRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', app.authenticate);

  app.get<{ Params: LocationParams }>('/locations/:locationId', {
    schema: {
      params: locationParamsSchema,
      response: {
        200: locationDetailSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const locationId = request.params.locationId.trim();

    const location = await getLocationById(locationId);
    if (!location) {
      return reply.status(HTTP_STATUS_NOT_FOUND).send(
        messageResponse(RESPONSE_MESSAGES.LOCATION_NOT_FOUND)
      );
    }

    return reply.status(HTTP_STATUS_OK).send(location);
  });

  app.put<{ Params: LocationParams; Body: LocationStoreQuery }>('/locations/:locationId', {
    schema: {
      params: locationParamsSchema,
      body: locationStoreSchema,
      response: {
        200: locationDetailSchema,
        400: errorResponseSchema,
        403: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    if (!(await app.checkWriteRateLimit(request, reply))) {
      return;
    }

    await app.authorizeAdmin(request, reply);
    if (reply.sent) {
      return;
    }

    const locationId = request.params.locationId.trim();
    const {
      name,
      type,
      openingHours: openingHoursCamel,
      'opening-hours': openingHoursHyphen,
      image,
      coordinates,
      radius,
    } = request.body;

    const openingHours = openingHoursCamel ?? openingHoursHyphen!;
    const parsedCoordinates = parseCoordinates(coordinates)!;

    const updatedLocation = await updateLocationById(locationId, {
      name,
      type,
      openingHours,
      image,
      coordinates: parsedCoordinates,
      radius,
    });

    if (!updatedLocation) {
      return reply.status(HTTP_STATUS_NOT_FOUND).send(
        messageResponse(RESPONSE_MESSAGES.LOCATION_NOT_FOUND)
      );
    }

    return reply.status(HTTP_STATUS_OK).send(updatedLocation);
  });

  app.get('/locations/bulk-create', async (request, reply) => {
    if (!(await app.checkWriteRateLimit(request, reply))) {
      return;
    }

    await createRandomLocations();

    return reply.status(HTTP_STATUS_CREATED).send(
      messageResponse(RESPONSE_MESSAGES.LOCATIONS_CREATED)
    );
  });

  app.get<{ Querystring: LocationSearchQuery }>('/locations/search', {
    schema: {
      querystring: locationSearchQuerySchema,
      response: {
        200: locationSearchResponseSchema,
        400: errorResponseSchema,
      },
    },
  }, async (request, reply) => {
    const x = parseFloat(request.query.x);
    const y = parseFloat(request.query.y);

    const nearby = await getNearbyLocations(x, y);
    if (!nearby) {
      return reply.status(HTTP_STATUS_OK).send({ 'user-location': `x=${x},y=${y}`, locations: [] });
    }

    return reply.status(HTTP_STATUS_OK).send(nearby);
  });
};

export { locationRoutes };
