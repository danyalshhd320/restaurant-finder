import jwt from 'jsonwebtoken';
import { app } from '../../app';
import { JWT_SECRET } from '../../config';
import { LocationResponse, NearbyLocationsResponse } from '../../interfaces/locations';

export const authFixtures = {
  validRole: 'admin' as const,
  validUsername: 'admin',
  validPassword: 'password',
  invalidRole: 'user' as const,

  validateToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { role: string; iat: number; exp: number };
  },

  async requestToken(role: 'admin' | 'user' = 'admin') {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: {
        username: this.validUsername,
        password: this.validPassword,
        role,
      },
    });

    const body = JSON.parse(response.body);
    return body.token as string;
  },
};

export const locationFixtures = {
  validLocation: {
    id: 'location-123',
    name: 'Sample Diner',
    type: 'Restaurant',
    'opening-hours': '10:00AM-10:00PM',
    image: 'https://example.com/image.jpg',
    coordinates: 'x=5,y=7',
  } as LocationResponse,

  nearbyLocations: {
    'user-location': 'x=5,y=7',
    locations: [
      {
        id: 'location-123',
        name: 'Sample Diner',
        coordinates: 'x=5,y=7',
        distance: 0,
      },
    ],
  } as NearbyLocationsResponse,
};
