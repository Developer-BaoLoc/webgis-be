CREATE TABLE IF NOT EXISTS rivers (
    osm_id BIGINT PRIMARY KEY,
    name TEXT,
    waterway TEXT,
    geom geometry(LineString,3857)
);

CREATE INDEX IF NOT EXISTS idx_rivers_geom
ON rivers
USING GIST (geom);
