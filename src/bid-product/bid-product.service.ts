import { Injectable } from '@nestjs/common';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { UpdateBidProductDto } from './dto/update-bid-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BidProduct } from "./entities/bid-product.entity";
import { Repository } from 'typeorm';

@Injectable()
export class BidProductService {
  constructor(
    @InjectRepository(BidProduct)
    private BidProductRepository: Repository<BidProduct>
  ){}

  async createBid(createBidProductDto: CreateBidProductDto) {
    const bid = new BidProduct()
    bid.product_id = createBidProductDto.product_id
    bid.StartDate = createBidProductDto.StartDate
    bid.EndDate = createBidProductDto.EndDate
    bid.StartPrice = createBidProductDto.StartPrice

    const insertBid = await this.BidProductRepository.insert(bid)
    return await this.BidProductRepository.findOneOrFail({ where:{id: insertBid.identifiers[0].id } })

  }

   findAll() {
    return this.BidProductRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.BidProductRepository.findOneOrFail({
        where:{id},
        relations: {product: true}
      })
    } catch (error) {
      throw error
    }
  }

  async updateBid(id: string, updateBidDto: UpdateBidProductDto) {
    try {
      await this.BidProductRepository.findOneOrFail({ where: {id} })
    } catch (error) {
      throw error
    }

    await this.BidProductRepository.update(id, updateBidDto);
    return this.BidProductRepository.findOneOrFail({ where:{id} })
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      await this.BidProductRepository.softDelete(id)
      return 'Success Deleted'
    } catch (error) {
      throw error
    }
  }
}
