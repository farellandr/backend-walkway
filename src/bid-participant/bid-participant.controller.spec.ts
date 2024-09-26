import { Test, TestingModule } from '@nestjs/testing';
import { BidParticipantController } from './bid-participant.controller';
import { BidParticipantService } from './bid-participant.service';

describe('BidParticipantController', () => {
  let controller: BidParticipantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidParticipantController],
      providers: [BidParticipantService],
    }).compile();

    controller = module.get<BidParticipantController>(BidParticipantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
