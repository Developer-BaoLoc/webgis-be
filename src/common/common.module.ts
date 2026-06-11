import { Module } from '@nestjs/common';

import { GeoJsonQueryService } from './services/geojson-query.service';

@Module({
  providers: [GeoJsonQueryService],
  exports: [GeoJsonQueryService],
})
export class CommonModule {}
