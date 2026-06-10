import { Controller, Get } from '@nestjs/common';
import { CooperativesService } from './cooperatives.service';

@Controller('cooperatives')
export class CooperativesController {
  constructor(
    private readonly cooperativesService: CooperativesService,
  ) {}

  @Get()
  findAll() {
    return this.cooperativesService.findAll();
  }
}
