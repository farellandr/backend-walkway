import { Test, TestingModule } from '@nestjs/testing';
import { DataBrandService } from './data-brand.service';

describe('DataBrandService', () => {
  let service: DataBrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataBrandService],
    }).compile();

    service = module.get<DataBrandService>(DataBrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
