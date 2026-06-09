# WebGIS Architecture

## Frontend

Framework: Next.js

Main features:

* Display map with Leaflet
* Search ward
* Show current location
* Display roads
* Display rivers
* Display ward boundaries

## Backend

Framework: NestJS

Modules:

* WardsModule
* RoadsModule
* RiversModule

Responsibilities:

* Query PostGIS data
* Return GeoJSON
* Spatial queries

## Database

PostgreSQL + PostGIS

Tables:

* wards
* roads
* rivers

Coordinate system:

* EPSG:3857
