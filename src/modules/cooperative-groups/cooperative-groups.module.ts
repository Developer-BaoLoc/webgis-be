import { Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';
import { CooperativeGroupsController } from './cooperative-groups.controller';
import { CooperativeGroupsService } from './cooperative-groups.service';

@Module({
  imports: [CommonModule],
  controllers: [CooperativeGroupsController],
  providers: [CooperativeGroupsService],
})
export class CooperativeGroupsModule {}
