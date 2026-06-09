# WebGIS API

NestJS backend that serves GeoJSON spatial data from PostGIS and handles JWT authentication.

## Modules

| Module | README | Responsibility |
|--------|--------|----------------|
| `auth/` | [README](src/modules/auth/README.md) | Login, JWT issuance, guards |
| `users/` | [README](src/modules/users/README.md) | User entity and admin endpoints |
| `wards/` | [README](src/modules/wards/README.md) | Ward boundaries, search, point-in-polygon |
| `roads/` | [README](src/modules/roads/README.md) | Road line geometries |
| `rivers/` | [README](src/modules/rivers/README.md) | River line geometries |

Entry point: `src/app.module.ts` — wires TypeORM, ConfigModule, and all feature modules.

## Environment variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name (default: `webgis`) |
| `JWT_SECRET` | Secret for signing access tokens |

## Setup

```bash
npm install
npm run start:dev   # watch mode on port 3001
```

## Tests

```bash
npm run test        # unit tests
npm run test:e2e    # end-to-end
npm run test:cov    # coverage
```

## API overview

Base URL: `http://localhost:3001`

Public GIS endpoints (`/wards`, `/roads`, `/rivers`) require no auth. Auth and user management endpoints are documented in the [auth](src/modules/auth/README.md) and [users](src/modules/users/README.md) module READMEs.

Full endpoint list: [docs/api.md](../docs/api.md).

## Data access pattern

GIS modules (`wards`, `roads`, `rivers`) use raw SQL via TypeORM `DataSource` with PostGIS functions (`ST_AsGeoJSON`, `ST_Transform`, `ST_Contains`). Geometries are stored in EPSG:3857 and returned to clients as EPSG:4326 GeoJSON.

The `users` module uses TypeORM entities and repositories.

## Seed system

To reset demo data:

```bash
npm run seed
```

Seed will:
- create admin user
- create normal user
- skip duplicates automatically