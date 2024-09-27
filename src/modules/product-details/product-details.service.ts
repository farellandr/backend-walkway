import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDetailDto } from './dto/create-product-detail.dto';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetail } from './entities/product-detail.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';

@Injectable()
export class ProductDetailsService {
  constructor(
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>
  ) { }

  async create(createProductDetailDto: CreateProductDetailDto) {
    const result = await this.productDetailRepository.insert(createProductDetailDto);

    return this.productDetailRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      }
    })
  }

  findAll() {
    return this.productDetailRepository.findAndCount({ relations: { product: true } });
  }

  async findOne(id: string) {
    try {
      return await this.productDetailRepository.findOneOrFail({
        where: {
          id,
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

  async update(id: string, updateProductDetailDto: UpdateProductDetailDto) {
    try {
      await this.productDetailRepository.findOneOrFail({
        where: {
          id,
        },
      });
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

    await this.productDetailRepository.update(id, updateProductDetailDto);

    return this.productDetailRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.productDetailRepository.findOneOrFail({
        where: {
          id,
        },
      });
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

    await this.productDetailRepository.softDelete(id);
  }
}
