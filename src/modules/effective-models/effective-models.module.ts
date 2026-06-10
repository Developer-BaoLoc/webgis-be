import { Module } from '@nestjs/common';
import { EffectiveModelsController } from './effective-models.controller';
import { EffectiveModelsService } from './effective-models.service';

@Module({
  controllers: [EffectiveModelsController],
  providers: [EffectiveModelsService],
})
export class EffectiveModelsModule {}
