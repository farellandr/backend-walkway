import { Test, TestingModule } from '@nestjs/testing';
import { BidProductsService } from './bid-products.service';

describe('BidProductsService', () => {
  let service: BidProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidProductsService],
    }).compile();

    service = module.get<BidProductsService>(BidProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
