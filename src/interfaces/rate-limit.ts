import { FastifyReply, FastifyRequest } from 'fastify';

export interface FastifyWriteRateLimiter {
  checkWriteRateLimit(request: FastifyRequest, reply: FastifyReply): Promise<boolean>;
}

export interface RateLimitRecord {
  count: number;
  expiresAt: number;
}
