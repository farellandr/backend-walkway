import { Test, TestingModule } from '@nestjs/testing';
import { BidProductController } from './bid-product.controller';
import { BidProductService } from './bid-product.service';

describe('BidProductController', () => {
  let controller: BidProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidProductController],
      providers: [BidProductService],
    }).compile();

    controller = module.get<BidProductController>(BidProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
