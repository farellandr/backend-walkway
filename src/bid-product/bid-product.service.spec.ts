import { Test, TestingModule } from '@nestjs/testing';
import { BidProductService } from './bid-product.service';

describe('BidProductService', () => {
  let service: BidProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidProductService],
    }).compile();

    service = module.get<BidProductService>(BidProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
