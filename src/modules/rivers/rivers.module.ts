import { Module } from '@nestjs/common';
import { RiversController } from './rivers.controller';
import { RiversService } from './rivers.service';

@Module({
  controllers: [RiversController],
  providers: [RiversService],
})
export class RiversModule {}