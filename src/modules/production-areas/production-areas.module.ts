import { Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';
import { ProductionAreasController } from './production-areas.controller';
import { ProductionAreasService } from './production-areas.service';

@Module({
  imports: [CommonModule],
  controllers: [ProductionAreasController],
  providers: [ProductionAreasService],
})
export class ProductionAreasModule {}
