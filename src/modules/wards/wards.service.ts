import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class WardsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

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
              'name', name,
              'admin_level', admin_level
            )
        )
      )
    ) AS geojson
    FROM wards
  `);

    return result[0].geojson;
  }

  async findWardByLocation(
    lat: number,
    lng: number,
  ) {
    const result = await this.dataSource.query(
      `
    SELECT
      name
    FROM wards
    WHERE ST_Contains(
      geom,
      ST_Transform(
        ST_SetSRID(
          ST_Point($1,$2),
          4326
        ),
        3857
      )
    )
    LIMIT 1
    `,
      [lng, lat],
    );

    return result[0] || null;
  }

  async search(q: string) {
    return this.dataSource.query(
      `
    SELECT
      osm_id,
      name
    FROM wards
    WHERE LOWER(name)
      LIKE LOWER($1)
    ORDER BY name
    LIMIT 10
    `,
      [`%${q}%`],
    );
  }

  async findOne(id: number) {
    const result =
      await this.dataSource.query(`
      SELECT
        json_build_object(
          'type',
          'Feature',
          'geometry',
          ST_AsGeoJSON(
            ST_Transform(geom,4326)
          )::json,
          'properties',
          json_build_object(
            'osm_id', osm_id,
            'name', name
          )
        ) geojson
      FROM wards
      WHERE osm_id = $1
    `, [id]);

    return result[0].geojson;
  }

}