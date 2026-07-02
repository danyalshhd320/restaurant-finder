# Restaurant Finder API

## Overview

This API provides restaurant lookup and search by coordinate. It supports:
- `POST /auth/token` to obtain a JWT token
- `GET /locations/:locationId` to fetch a restaurant detail
- `PUT /locations/:locationId` to create/update a restaurant
- `GET /locations/search?x=...&y=...` to find nearby restaurants
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

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Seed sample data

```bash
curl http://localhost:3000/seed
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
```
