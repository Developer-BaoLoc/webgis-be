import { Controller, Get } from '@nestjs/common';
import { CooperativeGroupsService } from './cooperative-groups.service';

@Controller('cooperative-groups')
export class CooperativeGroupsController {
  constructor(
    private readonly cooperativeGroupsService: CooperativeGroupsService,
  ) {}

  @Get()
  findAll() {
    return this.cooperativeGroupsService.findAll();
  }
}
