# Rivers Module

Serves river and waterway line geometries as GeoJSON.

## Purpose

Return all river/waterway features from the `rivers` table for map overlay rendering.

## Files

| File | Role |
|------|------|
| `rivers.controller.ts` | `GET /rivers` |
| `rivers.service.ts` | PostGIS → GeoJSON aggregation |
| `rivers.module.ts` | Module registration |

## Endpoints

### `GET /rivers`

Public. No authentication required.

Returns a GeoJSON `FeatureCollection`:

- **geometry**: LineString or MultiLineString (EPSG:4326)
- **properties**: `osm_id`, `name` (defaults to `"Không có tên"` if null), `waterway`

## Query pattern

Same aggregation pattern as the roads module: `json_build_object` + `ST_AsGeoJSON(ST_Transform(geom, 4326))`.

## Geometry

- Stored: EPSG:3857
- Returned: EPSG:4326
- Types: LineString, MultiLineString

## Data source

OpenStreetMap `waterway=*` features. Table: [infra/postgres/migrations/004_create_rivers.sql](../../../../infra/postgres/migrations/004_create_rivers.sql).

## Frontend integration

`useMapData.loadRivers()` fetches this endpoint lazily after wards load. Rendered by `RiverLayer`. See [webgis-client/components/map/README.md](../../../../webgis-client/components/map/README.md).
