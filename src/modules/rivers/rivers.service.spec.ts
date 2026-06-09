import { Test, TestingModule } from '@nestjs/testing';
import { RiversService } from './rivers.service';

describe('RiversService', () => {
  let service: RiversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiversService],
    }).compile();

    service = module.get<RiversService>(RiversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
