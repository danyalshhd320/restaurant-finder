import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { RATE_LIMIT_MAX_WRITES, RATE_LIMIT_WINDOW_MS } from '../config';
import { RateLimitRecord } from '../interfaces/rate-limit';
import { HTTP_STATUS_TOO_MANY_REQUESTS } from '../constants/statusCodes';
import { RESPONSE_MESSAGES } from '../constants/responses';
import { messageResponse } from '../utils';

declare module 'fastify' {
  interface FastifyInstance {
    checkWriteRateLimit(request: FastifyRequest, reply: FastifyReply): Promise<boolean>;
  }
}

const writeRateLimitStore: Record<string, RateLimitRecord | undefined> = {};

export const registerWriteRateLimit = (app: FastifyInstance): void => {
  app.decorate('checkWriteRateLimit', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip =
      request.ip ||
      request.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      'unknown';

    const now = Date.now();
    const existing = writeRateLimitStore[ip];

    if (!existing || existing.expiresAt <= now) {
      writeRateLimitStore[ip] = { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS };
      return true;
    }

    if (existing.count >= RATE_LIMIT_MAX_WRITES) {
      reply.status(HTTP_STATUS_TOO_MANY_REQUESTS).send(
        messageResponse(RESPONSE_MESSAGES.TOO_MANY_WRITE_REQUESTS)
      );
      return false;
    }

    existing.count += 1;
    return true;
  });
};
