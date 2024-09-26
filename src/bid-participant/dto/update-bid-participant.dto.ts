import { PartialType } from '@nestjs/swagger';
import { CreateBidParticipantDto } from './create-bid-participant.dto';

export class UpdateBidParticipantDto extends PartialType(CreateBidParticipantDto) {}
