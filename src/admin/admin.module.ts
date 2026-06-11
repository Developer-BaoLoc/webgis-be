import { Module } from '@nestjs/common';

import { AdminCrudController } from './controllers/admin-crud.controller';
import { AdminCrudService } from './services/admin-crud.service';

@Module({
  controllers: [AdminCrudController],
  providers: [AdminCrudService],
  exports: [AdminCrudService],
})
export class AdminModule {}
