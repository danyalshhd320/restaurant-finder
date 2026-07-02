import { app } from '../../app';
import { authFixtures } from './fixtures';
import { Restaurant } from '../../models/restaurants';

afterAll(async () => {
  await app.close();
});

describe('Location routes', () => {
  let token: string;
  let locationId: string;

  beforeAll(async () => {
    token = await authFixtures.requestToken('admin');
  });

  beforeEach(async () => {
    await Restaurant.deleteMany({});
    const location = await Restaurant.create({
      name: 'Sample Diner',
      type: 'Restaurant',
      openingHours: '10:00AM-10:00PM',
      image: 'https://example.com/image.jpg',
      coordinates: { x: 5, y: 7 },
      radius: 5,
    });
    locationId = location.id;
  });

  it('rejects unauthenticated requests', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/locations/${locationId}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('returns location data for a valid authenticated request', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/locations/${locationId}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      id: locationId,
      name: 'Sample Diner',
      type: 'Restaurant',
      'opening-hours': '10:00AM-10:00PM',
      image: 'https://example.com/image.jpg',
      coordinates: 'x=5,y=7',
    });
  });

  it('returns 404 for non-existing location', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/locations/00000000-0000-0000-0000-000000000000',
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns nearby locations for valid coordinates', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/locations/search?x=5&y=7',
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      'user-location': 'x=5,y=7',
      locations: [
        {
          id: locationId,
          name: 'Sample Diner',
          coordinates: 'x=5,y=7',
          distance: 0,
        },
      ],
    });
  });

  it('returns 400 for invalid search coordinates', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/locations/search?x=foo&y=bar',
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(400);
  });

  it('upserts a location when admin PUTs a new location id', async () => {
    const newLocationId = '11111111-1111-1111-1111-111111111111';
    const payload = {
      name: 'New Place',
      type: 'Restaurant',
      'opening-hours': '09:00-21:00',
      image: 'https://example.com/new.jpg',
      coordinates: 'x=8,y=9',
      radius: 3,
    };

    const response = await app.inject({
      method: 'PUT',
      url: `/locations/${newLocationId}`,
      payload,
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe(newLocationId);
    expect(body['opening-hours']).toBe('09:00-21:00');
    expect(body.coordinates).toBe('x=8,y=9');
  });
});
