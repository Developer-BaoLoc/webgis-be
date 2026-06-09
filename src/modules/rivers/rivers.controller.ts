import { Controller, Get } from '@nestjs/common';
import { RiversService } from './rivers.service';

@Controller('rivers')
export class RiversController {
  constructor(
    private readonly riversService: RiversService,
  ) {}

  @Get()
  findAll() {
    return this.riversService.findAll();
  }
}