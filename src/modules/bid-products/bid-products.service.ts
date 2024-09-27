import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { UpdateBidProductDto } from './dto/update-bid-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BidProduct } from './entities/bid-product.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class BidProductsService {
  constructor(
    @InjectRepository(BidProduct)
    private bidRepository: Repository<BidProduct>,
    private productRepository: ProductsService
  ) {}

  async create(createBidProductDto: CreateBidProductDto) {
    const { product, ...bidData } = createBidProductDto;
    const getProduct = await this.productRepository.findOne(product)

    const result = await this.bidRepository.insert({ ...bidData, product: getProduct })
    return await this.bidRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id
      },
      relations: {
        product: true
      }
    })
  }

  findAll() {
    return this.bidRepository.findAndCount({ relations: { product: true } });
  }

  async findOne(id: string) {
    try {
      return await this.bidRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          product: true
        }
      })
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateBidProductDto: UpdateBidProductDto) {
    const bid = await this.findOne(id);
    const { product, ...bidData } = updateBidProductDto;

    Object.assign(bid, bidData)

    await this.bidRepository.update(id, bid);
    return await this.bidRepository.findOneOrFail({
      where: {
        id
      },
      relations: {
        product: true
      }
    })
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.bidRepository.softDelete(id);
  }
}
