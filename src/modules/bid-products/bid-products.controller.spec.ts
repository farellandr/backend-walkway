import { Test, TestingModule } from '@nestjs/testing';
import { BidProductsController } from './bid-products.controller';
import { BidProductsService } from './bid-products.service';

describe('BidProductsController', () => {
  let controller: BidProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidProductsController],
      providers: [BidProductsService],
    }).compile();

    controller = module.get<BidProductsController>(BidProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
