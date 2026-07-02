import { app } from '../../app';
import { authFixtures } from './fixtures';

afterAll(async () => {
  await app.close();
});

describe('Auth routes', () => {
  it('returns 200 and a token for valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: {
        username: authFixtures.validUsername,
        password: authFixtures.validPassword,
        role: authFixtures.validRole,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.token).toEqual(expect.any(String));

    const payload = authFixtures.validateToken(body.token);
    expect(payload.role).toBe(authFixtures.validRole);
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  it('returns 401 for invalid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: {
        username: authFixtures.validUsername,
        password: 'wrong-password',
        role: authFixtures.validRole,
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
