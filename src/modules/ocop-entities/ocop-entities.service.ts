import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class OcopEntitiesService {
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
              ST_AsGeoJSON(geom)::json,
            'properties',
              json_build_object(
                'id', id,
                'name', name,
                'representative', representative,
                'address', address,
                'phone', phone,
                'status', status
              )
          )
        )
      ) AS geojson
      FROM ocop_entities
    `);

    return result[0].geojson;
  }
}
