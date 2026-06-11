import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import {
  geojsonIconSubquery,
  geojsonImagesSubquery,
} from '../sql/geojson-media.sql';
import { getEntityConfig } from '../../admin/config/entity-admin.config';

@Injectable()
export class GeoJsonQueryService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAllGeoJson(entityKey: string) {
    const config = getEntityConfig(entityKey);

    const propertyLines =
      config.geoJsonProperties
        .map(
          (column) =>
            `'${column}', t.${column}`,
        )
        .join(',\n                ');

    const result = await this.dataSource.query(`
      WITH records AS (
        SELECT DISTINCT ON (t.id) t.*
        FROM ${config.tableName} t
        WHERE t.geom IS NOT NULL
        ORDER BY t.id
      )
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features',
        COALESCE(
          json_agg(
            json_build_object(
              'type', 'Feature',
              'id', t.id,
              'geometry',
              ST_AsGeoJSON(t.geom)::json,
              'properties',
              json_build_object(
                ${propertyLines},
                'icon', ${geojsonIconSubquery(config.mediaEntityType, 't')},
                'images', ${geojsonImagesSubquery(config.mediaEntityType, 't')}
              )
            )
            ORDER BY t.id
          ),
          '[]'::json
        )
      ) AS geojson
      FROM records t
    `);

    return result[0].geojson;
  }
}
