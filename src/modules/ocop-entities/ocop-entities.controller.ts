import { Controller, Get } from '@nestjs/common';
import { OcopEntitiesService } from './ocop-entities.service';

@Controller('ocop-entities')
export class OcopEntitiesController {
  constructor(
    private readonly ocopEntitiesService: OcopEntitiesService,
  ) {}

  @Get()
  findAll() {
    return this.ocopEntitiesService.findAll();
  }
}
