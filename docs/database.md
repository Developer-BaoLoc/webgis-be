# Database

Database: webgis

Extension:

* PostGIS

Tables:

## wards

Columns:

* osm_id
* name
* admin_level
* geom

## roads

Columns:

* osm_id
* name
* highway
* geom

## rivers

Columns:

* osm_id
* name
* waterway
* geom

Indexes:

* idx_wards_geom
* idx_roads_geom
* idx_rivers_geom
