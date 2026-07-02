import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import { AUTH_PASSWORD, AUTH_USERNAME, JWT_EXPIRES_IN, JWT_SECRET } from '../config';
import { AuthTokenRequest } from '../interfaces/auth';
import { authTokenSchema } from '../schemas/auth';
import { HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from '../constants/statusCodes';
import { RESPONSE_MESSAGES } from '../constants/responses';
import { messageResponse } from '../utils';

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: AuthTokenRequest }>('/auth/token', { schema: authTokenSchema }, async (request, reply) => {
    const { username, password, role } = request.body;

    if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
      return reply.status(HTTP_STATUS_UNAUTHORIZED).send(
        messageResponse(RESPONSE_MESSAGES.INVALID_CREDENTIALS)
      );
    }

    const token = jwt.sign({ role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return reply.status(HTTP_STATUS_OK).send({ token });
  });
};

export { authRoutes };
