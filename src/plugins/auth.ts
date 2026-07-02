import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import {
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_FORBIDDEN,
} from '../constants/statusCodes';
import { RESPONSE_MESSAGES } from '../constants/responses';
import { messageResponse } from '../utils';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { role: string };
  }

  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    authorizeAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

export const registerAuthentication = (app: FastifyInstance): void => {
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return reply.status(HTTP_STATUS_UNAUTHORIZED).send(
        messageResponse(RESPONSE_MESSAGES.MISSING_AUTH_HEADER)
      );
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return reply.status(HTTP_STATUS_UNAUTHORIZED).send(
        messageResponse(RESPONSE_MESSAGES.INVALID_AUTH_TOKEN)
      );
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { role: string };
      request.user = { role: payload.role };
    } catch (error) {
      return reply.status(HTTP_STATUS_UNAUTHORIZED).send(
        messageResponse(RESPONSE_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
      );
    }
  });

  app.decorate('authorizeAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== 'admin') {
      return reply.status(HTTP_STATUS_FORBIDDEN).send(
        messageResponse(RESPONSE_MESSAGES.ADMIN_ROLE_REQUIRED)
      );
    }
  });
};
