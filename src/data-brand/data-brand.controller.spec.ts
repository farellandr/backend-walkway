import { Test, TestingModule } from '@nestjs/testing';
import { DataBrandController } from './data-brand.controller';

describe('DataBrandController', () => {
  let controller: DataBrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataBrandController],
    }).compile();

    controller = module.get<DataBrandController>(DataBrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
