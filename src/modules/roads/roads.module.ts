import { Module } from '@nestjs/common';
import { RoadsController } from './roads.controller';
import { RoadsService } from './roads.service';

@Module({
  controllers: [RoadsController],
  providers: [RoadsService],
})
export class RoadsModule {}