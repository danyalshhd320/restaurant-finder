import 'dotenv/config';
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { authRoutes } from './routes/auth';
import { locationRoutes } from './routes/locations';
import { seedRoutes } from './routes/seed';
import { registerAuthentication } from './plugins/auth';
import { registerWriteRateLimit } from './plugins/rate-limit';
import { HTTP_STATUS_NOT_FOUND } from './constants/statusCodes';
import { RESPONSE_MESSAGES } from './constants/responses';
import { messageResponse } from './utils';

const app = Fastify({
  trustProxy: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Restaurant Finder API',
      description: 'API for searching restaurants by location',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

registerAuthentication(app);
registerWriteRateLimit(app);
app.register(authRoutes);
app.register(locationRoutes);
app.register(seedRoutes);

app.setNotFoundHandler(async (_request, reply) => {
  return reply.status(HTTP_STATUS_NOT_FOUND).send(messageResponse(RESPONSE_MESSAGES.NOT_FOUND));
});

export { app };
