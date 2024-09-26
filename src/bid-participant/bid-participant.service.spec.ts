import { Test, TestingModule } from '@nestjs/testing';
import { BidParticipantService } from './bid-participant.service';

describe('BidParticipantService', () => {
  let service: BidParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidParticipantService],
    }).compile();

    service = module.get<BidParticipantService>(BidParticipantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
