CREATE TABLE IF NOT EXISTS wards (
    osm_id BIGINT PRIMARY KEY,
    name TEXT,
    admin_level TEXT,
    geom geometry(Geometry,3857)
);

CREATE INDEX IF NOT EXISTS idx_wards_geom
ON wards
USING GIST (geom);
