import { Module } from '@nestjs/common';
import { BidParticipantService } from './bid-participant.service';
import { BidParticipantController } from './bid-participant.controller';
import { BidParticipant } from "./entities/bid-participant.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidProductModule } from "#/bid-product/bid-product.module";
import { PaymentModule } from "#/payment/payment.module";

@Module({
  imports: [PaymentModule, BidProductModule, TypeOrmModule.forFeature([BidParticipant])],
  controllers: [BidParticipantController],
  providers: [BidParticipantService]
})
export class BidParticipantModule {}
