import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';
import { BrandService } from '../brand/brand.service';
import { ProductDetail } from './entities/product-detail.entity';
import { CategoryService } from '../category/category.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UserService } from '../user/user.service';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { BidProduct } from './entities/bid-product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(BidProduct)
    private readonly bidProductRepository: Repository<BidProduct>,
    private readonly brandRepository: BrandService,
    private readonly categoryRepository: CategoryService,
    private readonly userCartRepository: UserService,
  ) { }

  async addToBid(createBidProductDto: CreateBidProductDto) {
    try {
      const productDetail = await this.findProductDetail(createBidProductDto.productDetailId);

      if (productDetail.stock - 1 >= 0) {
        await this.productDetailRepository.save({ ...productDetail, stock: productDetail.stock - 1 })
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: 'Stock is not available.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const result = await this.bidProductRepository.insert(createBidProductDto)

      return await this.bidProductRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
        relations: {
          productDetail: {
            product: true
          }
        }
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findProductDetail(id: string) {
    try {
      return await this.productDetailRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async addToCart(createCartItemDto: CreateCartItemDto) {
    try {
      const [productDetail, cart] = await Promise.all([
        this.findProductDetail(createCartItemDto.productDetailId),
        this.userCartRepository.findCart(createCartItemDto.cartId)
      ])

      if (productDetail.stock - 1 >= 0) {
        await this.productDetailRepository.save({ ...productDetail, stock: productDetail.stock - 1 })
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: 'Stock is not available.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return await this.userCartRepository.createCartItem(createCartItemDto)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const [brand, category] = await Promise.all([
        this.brandRepository.findOne(createProductDto.brandId),
        this.categoryRepository.findMany(createProductDto.categoryId)
      ])

      const product = new Product;
      product.name = brand.name + ' ' + createProductDto.name;
      product.price = createProductDto.price;
      product.brandId = createProductDto.brandId;
      product.categories = category;

      const result = await this.productRepository.insert(product);
      for (const detail of createProductDto.productDetails) {
        await this.productDetailRepository.insert({ ...detail, productId: result.identifiers[0].id });
      }

      await this.productRepository.save(product)
      return await this.productRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
        relations: {
          brand: true,
          categories: true,
          productDetails: true,
        }
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: {
          productDetails: true,
        }
      })
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

    }
  }

  async findOne(id: string) {
    try {
      return await this.productRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      await this.productRepository.findOneOrFail({
        where: { id },
      });

      await this.productRepository.update(id, updateProductDto);
      return await this.productRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


  async remove(id: string) {
    try {
      await this.productRepository.findOneOrFail({
        where: { id },
      });

      await this.productRepository.softDelete(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
