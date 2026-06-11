import { Injectable } from '@nestjs/common';

import { GeoJsonQueryService } from '../../common/services/geojson-query.service';

@Injectable()
export class ProductionAreasService {
  constructor(
    private readonly geoJsonQueryService: GeoJsonQueryService,
  ) {}

  findAll() {
    return this.geoJsonQueryService.findAllGeoJson(
      'production-areas',
    );
  }
}
