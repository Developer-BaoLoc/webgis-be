# PostgreSQL Infrastructure

PostgreSQL database with PostGIS extension for spatial storage and queries.

## Database

- Name: `webgis`
- Extension: `postgis` (enabled in migration `001_enable_postgis.sql`)

## Setup

```bash
createdb webgis
psql webgis -f setup.sql
```

`setup.sql` runs all migrations in order from `migrations/`.

## Migrations

| File | Creates |
|------|---------|
| `001_enable_postgis.sql` | `CREATE EXTENSION postgis` |
| `002_create_wards.sql` | `wards` table + GIST index |
| `003_create_roads.sql` | `roads` table + GIST index |
| `004_create_rivers.sql` | `rivers` table + GIST index |
| `005_create_users.sql` | `users` table |

## Tables

### `wards`

| Column | Type | Notes |
|--------|------|-------|
| `osm_id` | `BIGINT` | PK |
| `name` | `TEXT` | |
| `admin_level` | `TEXT` | |
| `geom` | `geometry(Geometry, 3857)` | GIST index |

### `roads`

| Column | Type | Notes |
|--------|------|-------|
| `osm_id` | `BIGINT` | PK |
| `name` | `TEXT` | |
| `highway` | `TEXT` | OSM highway tag |
| `geom` | `geometry(Geometry, 3857)` | GIST index |

### `rivers`

| Column | Type | Notes |
|--------|------|-------|
| `osm_id` | `BIGINT` | PK |
| `name` | `TEXT` | |
| `waterway` | `TEXT` | OSM waterway tag |
| `geom` | `geometry(Geometry, 3857)` | GIST index |

### `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `BIGSERIAL` | PK |
| `email` | `TEXT` | unique |
| `password_hash` | `TEXT` | bcrypt hash |
| `role` | `TEXT` | `ADMIN` or `USER` |
| `created_at` | `TIMESTAMP` | default `NOW()` |
| `updated_at` | `TIMESTAMP` | default `NOW()` |

## Coordinate system

- Storage: **EPSG:3857** (Web Mercator)
- API output: **EPSG:4326** (WGS84 lat/lng) via `ST_Transform`

## Spatial functions used by the API

| Function | Usage |
|----------|-------|
| `ST_AsGeoJSON` | Serialize geometry to GeoJSON |
| `ST_Transform` | Reproject between 3857 and 4326 |
| `ST_Contains` | Point-in-polygon ward lookup |
| `ST_SetSRID` / `ST_Point` | Build query points |

## Related docs

- [docs/database.md](../../docs/database.md) — column reference
- Backend modules: [wards](../../webgis-api/src/modules/wards/README.md), [roads](../../webgis-api/src/modules/roads/README.md), [rivers](../../webgis-api/src/modules/rivers/README.md), [users](../../webgis-api/src/modules/users/README.md)
