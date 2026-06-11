import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../../modules/auth/decorators/roles.decorator';
import { AdminCrudService } from '../services/admin-crud.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminCrudController {
  constructor(
    private readonly adminCrudService: AdminCrudService,
  ) {}

  @Get(':entity')
  findAll(@Param('entity') entity: string) {
    return this.adminCrudService.findAllRecords(
      entity,
    );
  }

  @Get(':entity/:id')
  findOne(
    @Param('entity') entity: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminCrudService.findOneRecord(
      entity,
      id,
    );
  }

  @Post(':entity')
  create(
    @Param('entity') entity: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.adminCrudService.createRecord(
      entity,
      body,
    );
  }

  @Put(':entity/:id')
  update(
    @Param('entity') entity: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    return this.adminCrudService.updateRecord(
      entity,
      id,
      body,
    );
  }

  @Delete(':entity/:id')
  remove(
    @Param('entity') entity: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminCrudService.deleteRecord(
      entity,
      id,
    );
  }
}
