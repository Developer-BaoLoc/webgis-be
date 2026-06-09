CREATE TABLE IF NOT EXISTS roads (
    osm_id BIGINT PRIMARY KEY,
    name TEXT,
    highway TEXT,
    geom geometry(LineString,3857)
);

CREATE INDEX IF NOT EXISTS idx_roads_geom
ON roads
USING GIST (geom);
