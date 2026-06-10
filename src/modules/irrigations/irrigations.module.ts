import { Module } from '@nestjs/common';
import { IrrigationsController } from './irrigations.controller';
import { IrrigationsService } from './irrigations.service';

@Module({
  controllers: [IrrigationsController],
  providers: [IrrigationsService],
})
export class IrrigationsModule {}
