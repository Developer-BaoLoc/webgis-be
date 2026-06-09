# Roads Module

Serves road network line geometries as GeoJSON.

## Purpose

Return all road features from the `roads` table for map overlay rendering.

## Files

| File | Role |
|------|------|
| `roads.controller.ts` | `GET /roads` |
| `roads.service.ts` | PostGIS → GeoJSON aggregation |
| `roads.module.ts` | Module registration |

## Endpoints

### `GET /roads`

Public. No authentication required.

Returns a GeoJSON `FeatureCollection`:

- **geometry**: LineString or MultiLineString (EPSG:4326)
- **properties**: `osm_id`, `name` (defaults to `"Không có tên"` if null), `highway`

## Query pattern

Single SQL query builds the full FeatureCollection with `json_build_object`, `json_agg`, and `ST_AsGeoJSON(ST_Transform(geom, 4326))`.

## Geometry

- Stored: EPSG:3857
- Returned: EPSG:4326
- Types: LineString, MultiLineString

## Data source

OpenStreetMap `highway=*` features. Table: [infra/postgres/migrations/003_create_roads.sql](../../../../infra/postgres/migrations/003_create_roads.sql).

## Frontend integration

`useMapData.loadRoads()` fetches this endpoint lazily after wards load. Rendered by `RoadLayer` when zoom exceeds the layer threshold. See [webgis-client/components/map/README.md](../../../../webgis-client/components/map/README.md).
