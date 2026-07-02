# Restaurant Finder API

## Demo Video
https://www.loom.com/share/432322ebcd5c41f3a474ffc7ae2193d4

## Overview

This API provides restaurant lookup and search by coordinate. It supports:
- `POST /auth/token` to obtain a JWT token
- `GET /locations/:locationId` to fetch a restaurant detail
- `PUT /locations/:locationId` to create/update a restaurant using admin role only
- `GET /locations/search?x=...&y=...` to find nearby restaurants
- `GET /locations/bulk-create` to store random locations 100 currently
- `GET /seed` to load sample restaurant data from `src/data/locations.json`
- Swagger UI at `/docs`

## Environment

Create a `.env` file from `.env.example` and override values as needed:

```bash
cp .env.example .env
```

Example `.env` values:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/locations
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=1h
AUTH_USERNAME=admin
AUTH_PASSWORD=password
```

## Folder Structure

```
restaurant-finder/
├── README.md
├── DockerFile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── config.ts
│   ├── constants/
│   │   ├── responses.ts
│   │   └── statusCodes.ts
│   ├── data/
│   │   └── locations.json
│   ├── definitions/
│   │   └── nearbyLocations.ts
│   ├── interfaces/
│   │   ├── auth.ts
│   │   ├── locations.ts
│   │   └── routes.ts
│   ├── models/
│   │   └── restaurants.ts
│   ├── plugins/
│   │   ├── auth.ts
│   │   └── rate-limit.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── locations.ts
│   │   └── seed.ts
│   ├── schemas/
│   │   ├── auth.ts
│   │   └── locations.ts
│   ├── services/
│   │   ├── locations.ts
│   │   └── seed.ts
│   ├── test/
│   │   └── setup.ts
│   └── utils/
│       └── index.ts
└── node_modules/
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Run with docker(Preferred)

```bash
docker compose up -d --build
```

## Seed sample data

```bash
curl http://localhost:3000/seed
curl localhost:3000/locations/bulk-create' \
  -H Authorization: Bearer <TOKEN>
```

## Authentication

Request a token with valid credentials:

```bash
curl -X POST http://localhost:3000/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password","role":"admin"}'
```

Use the token for protected routes:

```bash
-H 'Authorization: Bearer <TOKEN>'
```

## Example requests

Get a restaurant:

```bash
curl http://localhost:3000/locations/<uuid> \
  -H 'Authorization: Bearer <TOKEN>'
```

Search nearby restaurants:

```bash
curl http://localhost:3000/locations/search?x=5&y=7 \
  -H 'Authorization: Bearer <TOKEN>'
```

Create/update a restaurant (admin only):

```bash
curl -X PUT http://localhost:3000/locations/<uuid> \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"New Place","type":"Restaurant","openingHours":"09:00-21:00","image":"https://example.com/new.jpg","coordinates":"x=8,y=9","radius":3}'
```

## Tests

```bash
npm run test
docker compose run --rm test 
```

## Improvements

```
Logging/metrics to be added 'winston' for request and response
API versioning

geospatial indexing can be added but since we numeric coordinates in this test (for millions of points)

use elasticsearch if read volume gets too high

for global users Database replication to be added with routing to be done based on nearest region

Multi region disaster recovery to be incorporated 
```

## Assumptions

```
For performance improvements the json file is loaded into mongodb and added a compound index on coordinates to search efficiently millions of records

Radius by default for the user is assumed so to shorten the locality where the user is and this in turn makes the query faster as well

Docker container is used for installation and running test and application. For CI pipeline as well everything including mongodb is running in containers

The algorithm to find the distance is (d = sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}))

Distance should be smaller than radius in order for location to show up for user

simple username,password is used for generating token and making a role

```
