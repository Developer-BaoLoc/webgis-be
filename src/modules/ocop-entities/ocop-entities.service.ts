import { Injectable } from '@nestjs/common';

import { GeoJsonQueryService } from '../../common/services/geojson-query.service';

@Injectable()
export class OcopEntitiesService {
  constructor(
    private readonly geoJsonQueryService: GeoJsonQueryService,
  ) {}

  findAll() {
    return this.geoJsonQueryService.findAllGeoJson(
      'ocop-entities',
    );
  }
}
