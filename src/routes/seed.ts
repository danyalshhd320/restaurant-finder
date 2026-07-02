import { FastifyPluginAsync } from 'fastify';
import { seedRestaurants } from '../services/seed';
import { HTTP_STATUS_OK } from '../constants/statusCodes';
import { RESPONSE_MESSAGES } from '../constants/responses';
import { messageResponse } from '../utils';

const seedRoutes: FastifyPluginAsync = async (app) => {
  app.get('/seed', async (_request, reply) => {
    await seedRestaurants();
    return reply.status(HTTP_STATUS_OK).send(
      messageResponse(RESPONSE_MESSAGES.SEED_DATA_LOADED)
    );
  });
};

export { seedRoutes };
