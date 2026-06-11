import { Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';
import { EffectiveModelsController } from './effective-models.controller';
import { EffectiveModelsService } from './effective-models.service';

@Module({
  imports: [CommonModule],
  controllers: [EffectiveModelsController],
  providers: [EffectiveModelsService],
})
export class EffectiveModelsModule {}
