import { Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';
import { IrrigationsController } from './irrigations.controller';
import { IrrigationsService } from './irrigations.service';

@Module({
  imports: [CommonModule],
  controllers: [IrrigationsController],
  providers: [IrrigationsService],
})
export class IrrigationsModule {}
