import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RiversService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const result = await this.dataSource.query(`
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
          json_build_object(
            'type', 'Feature',
            'geometry',
              ST_AsGeoJSON(
                ST_Transform(geom, 4326)
              )::json,
            'properties',
              json_build_object(
                'osm_id', osm_id,
                'name', COALESCE(name, 'Không có tên'),
                'waterway', waterway
              )
          )
        )
      ) AS geojson
      FROM rivers
    `);

    return result[0].geojson;
  }
}