import { Controller, Get } from '@nestjs/common';
import { ProductionAreasService } from './production-areas.service';

@Controller('production-areas')
export class ProductionAreasController {
  constructor(
    private readonly productionAreasService: ProductionAreasService,
  ) {}

  @Get()
  findAll() {
    return this.productionAreasService.findAll();
  }
}
