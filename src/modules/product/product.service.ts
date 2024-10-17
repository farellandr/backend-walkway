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
import { CommonErrorHandler } from '#/utils/helpers/error-handler';
import { BidParticipant } from './entities/bid-participant.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(BidProduct)
    private readonly bidProductRepository: Repository<BidProduct>,
    @InjectRepository(BidParticipant)
    private readonly bidParticipantRepository: Repository<BidParticipant>,
    private readonly brandRepository: BrandService,
    private readonly categoryRepository: CategoryService,
    private readonly userCartRepository: UserService,
  ) { }

  async participateBid(body: any) {
    try {
      const [bidProduct, user] = await Promise.all([
        this.bidProductRepository.findOneOrFail({ where: { id: body.bidProductId } }),
        this.userCartRepository.findOne(body.userId)
      ])

      const result = await this.bidParticipantRepository.insert({ bidProductId: bidProduct.id, userId: user.id, amount: body.amount })
      return await this.bidParticipantRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
        relations: {
          bidProduct: {
            productDetail: {
              product: true
            }
          },
          user: true
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async addToBid(createBidProductDto: CreateBidProductDto) {
    try {
      const productDetail = await this.findProductDetail(createBidProductDto.productDetailId);

      if (productDetail.stock - 1 >= 0) {
        await this.productDetailRepository.save({ ...productDetail, stock: productDetail.stock - 1 })
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request.',
            message: 'Stock is not available.',
          },
          HttpStatus.BAD_REQUEST,
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
      CommonErrorHandler(error);
    }
  }

  async findManyProductDetail(ids: string[]) {
    try {
      const categories = await Promise.all(
        ids.map(async (id) => {
          return await this.productDetailRepository.findOneOrFail({
            where: { id },
            relations: {
              product: true
            }
          });
        })
      );

      return categories;
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findProductDetail(id: string) {
    try {
      return await this.productDetailRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      CommonErrorHandler(error);
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
            error: 'Bad Request.',
            message: 'Stock is not available.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return await this.userCartRepository.createCartItem(createCartItemDto)
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const [brand, category] = await Promise.all([
        this.brandRepository.findOne(createProductDto.brandId),
        this.categoryRepository.findMany(createProductDto.categoryId)
      ])
      const sizes = createProductDto.productDetails.map(detail => detail.size);
      const hasDuplicate = sizes.some((size, index) => sizes.indexOf(size) !== index);
      if (hasDuplicate) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: 'Size must not be a duplicate.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const product = new Product;
      product.name = brand.name + ' ' + createProductDto.name;
      product.price = createProductDto.price;
      product.brandId = createProductDto.brandId;
      product.categories = category;
      product.weight = createProductDto.weight

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
      CommonErrorHandler(error);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: {
          brand: true,
          productDetails: true,
          categories: true
        }
      })
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.productRepository.findOneOrFail({
        where: {
          id
        },
        relations: {
          brand: true,
          categories: true,
          productDetails: true,
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOneOrFail({
        where: { id },
        relations: {
          productDetails: true,
          brand: true
        }
      });

      const { categoryId, productDetails, ...updateProductData } = updateProductDto;

      Object.assign(product, updateProductData);

      const [brand, category] = await Promise.all([
        this.brandRepository.findOne(updateProductDto.brandId),
        this.categoryRepository.findMany(categoryId)
      ]);
      product.name = brand.name + ' ' + product.name;
      product.categories = category;

      await this.productRepository.save(product)

      for (const detail of productDetails) {
        const existingDetail = product.productDetails.find((d) => d.size === detail.size);

        if (existingDetail) {
          existingDetail.stock = detail.stock;
          await this.productDetailRepository.update(existingDetail.id, { stock: detail.stock });
        } else {
          await this.productDetailRepository.insert({ ...detail, productId: product.id })
        }
      }
      return await this.productRepository.findOneOrFail({
        where: {
          id
        },
        relations: {
          brand: true,
          categories: true,
          productDetails: true
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      await this.productRepository.findOneOrFail({
        where: { id },
      });

      await this.productRepository.softDelete(id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
