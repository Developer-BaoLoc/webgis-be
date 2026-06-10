import { Controller, Get } from '@nestjs/common';
import { IrrigationsService } from './irrigations.service';

@Controller('irrigations')
export class IrrigationsController {
  constructor(
    private readonly irrigationsService: IrrigationsService,
  ) {}

  @Get()
  findAll() {
    return this.irrigationsService.findAll();
  }
}
