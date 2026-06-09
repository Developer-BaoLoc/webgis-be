import { Controller, Get, Query } from '@nestjs/common';
import { WardsService } from './wards.service';

@Controller('wards')
export class WardsController {
  constructor(
    private readonly wardsService: WardsService,
  ) { }

  @Get()
  findAll() {
    return this.wardsService.findAll();
  }

  @Get('current')
  findCurrentWard(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.wardsService.findWardByLocation(
      Number(lat),
      Number(lng),
    );
  }
  
  @Get('search')
  search(
    @Query('q') q: string,
  ) {
    return this.wardsService.search(q);
  }
}