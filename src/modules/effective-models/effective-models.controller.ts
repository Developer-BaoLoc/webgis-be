import { Controller, Get } from '@nestjs/common';
import { EffectiveModelsService } from './effective-models.service';

@Controller('effective-models')
export class EffectiveModelsController {
  constructor(
    private readonly effectiveModelsService: EffectiveModelsService,
  ) {}

  @Get()
  findAll() {
    return this.effectiveModelsService.findAll();
  }
}
