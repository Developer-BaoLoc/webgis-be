import { Module } from '@nestjs/common';
import { OcopEntitiesController } from './ocop-entities.controller';
import { OcopEntitiesService } from './ocop-entities.service';

@Module({
  controllers: [OcopEntitiesController],
  providers: [OcopEntitiesService],
})
export class OcopEntitiesModule {}
