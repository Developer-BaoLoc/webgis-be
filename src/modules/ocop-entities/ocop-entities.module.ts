import { Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';
import { OcopEntitiesController } from './ocop-entities.controller';
import { OcopEntitiesService } from './ocop-entities.service';

@Module({
  imports: [CommonModule],
  controllers: [OcopEntitiesController],
  providers: [OcopEntitiesService],
})
export class OcopEntitiesModule {}
