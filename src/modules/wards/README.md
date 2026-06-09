# Wards Module

Serves ward (administrative boundary) polygons as GeoJSON and supports spatial lookup and name search.

## Purpose

- Return all ward boundaries as a GeoJSON `FeatureCollection`
- Resolve which ward contains a given lat/lng (point-in-polygon)
- Search wards by name (partial match)

## Files

| File | Role |
|------|------|
| `wards.controller.ts` | HTTP endpoints |
| `wards.service.ts` | PostGIS queries |
| `wards.module.ts` | Module registration |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/wards` | none | Full ward GeoJSON FeatureCollection |
| `GET` | `/wards/current?lat=&lng=` | none | Ward name at coordinates |
| `GET` | `/wards/search?q=` | none | Up to 10 wards matching name |

### `GET /wards` response shape

GeoJSON `FeatureCollection`. Each feature:

- **geometry**: Polygon or MultiPolygon (EPSG:4326)
- **properties**: `osm_id`, `name`, `admin_level`

### `GET /wards/current`

Query params: `lat`, `lng` (WGS84). Returns `{ name }` or `null` if no ward contains the point.

Uses `ST_Contains` with the point transformed from EPSG:4326 to EPSG:3857 to match stored geometry.

### `GET /wards/search`

Case-insensitive `LIKE` on `name`. Returns `[{ osm_id, name }, ...]`.

## Internal method

`findOne(osm_id)` — returns a single ward Feature (used internally; not exposed on controller).

## Data source

OpenStreetMap administrative boundaries, loaded into the `wards` table. See [infra/postgres/README.md](../../../../infra/postgres/README.md).

## Geometry

- Stored: EPSG:3857 (`geometry(Geometry, 3857)`)
- Returned: EPSG:4326 via `ST_Transform(geom, 4326)`
- Types: Polygon, MultiPolygon

## Frontend integration

- `useMapData` fetches `GET /wards` on mount
- `useCurrentLocation` calls `GET /wards/current`
- `useWardSearch` filters loaded ward features client-side (server search endpoint also available)

See [webgis-client/components/map/README.md](../../../../webgis-client/components/map/README.md).
