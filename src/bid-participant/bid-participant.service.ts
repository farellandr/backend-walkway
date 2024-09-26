import { Injectable } from '@nestjs/common';
import { CreateBidParticipantDto } from './dto/create-bid-participant.dto';
import { UpdateBidParticipantDto } from './dto/update-bid-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BidParticipant } from './entities/bid-participant.entity';

@Injectable()
export class BidParticipantService {
  constructor(
    @InjectRepository(BidParticipant)
    private BidParticipantRepo: Repository<BidParticipant>,
  ) {}

  async create(createBidParticipantDto: CreateBidParticipantDto) {
    const Biduser = new BidParticipant();
    Biduser.bidProduct_id = createBidParticipantDto.bidProduct_id;
    Biduser.payment_id = createBidParticipantDto.payment_id;
    Biduser.amount = createBidParticipantDto.amount;

    const userBid = await this.BidParticipantRepo.insert(Biduser);
    return await this.BidParticipantRepo.findOneOrFail({
      where: { id: userBid.identifiers[0].id },
    });
  }

  findAll() {
    return this.BidParticipantRepo.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.BidParticipantRepo.findOneOrFail({
        where:{id},
        relations:{
          bidProduct: true, 
          payment:true }
      })
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateBidParticipantDto: UpdateBidParticipantDto) {
    try {
      await this.BidParticipantRepo.findOneOrFail({ where:{id} })
    } catch (error) {
      throw error
    }

    await this.BidParticipantRepo.update(id, updateBidParticipantDto);
    return this.BidParticipantRepo.findOneOrFail({ where:{id} })
  }

  async remove(id: string) {
   try {
    await this.findOne(id)
    await this.BidParticipantRepo.softDelete(id)
    return 'Success Deleted'
   } catch (error) {
      throw error
   }
  }
}
