import { Test, TestingModule } from '@nestjs/testing';
import { RiversController } from './rivers.controller';

describe('RiversController', () => {
  let controller: RiversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiversController],
    }).compile();

    controller = module.get<RiversController>(RiversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
