import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, ILike, In, LessThanOrEqual, Like, Repository } from 'typeorm';
import { BrandService } from '../brand/brand.service';
import { ProductDetail } from './entities/product-detail.entity';
import { CategoryService } from '../category/category.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UserService } from '../user/user.service';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { BidProduct } from './entities/bid-product.entity';
import { BidParticipant } from './entities/bid-participant.entity';
import { ProductPhoto } from './entities/product-photo.entity';
import { PhotoType } from '#/utils/enums/photo-types.enum';
import { JwtService } from '@nestjs/jwt';
import { CartItem } from '../user/entities/cart-item.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(ProductPhoto)
    private readonly productPhotoRepository: Repository<ProductPhoto>,
    @InjectRepository(BidProduct)
    private readonly bidProductRepository: Repository<BidProduct>,
    @InjectRepository(BidParticipant)
    private readonly bidParticipantRepository: Repository<BidParticipant>,
    private readonly brandRepository: BrandService,
    private readonly categoryRepository: CategoryService,
    private readonly userCartRepository: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  @Cron('* * * * * *')
  async handleEndedAuctions() {
    try {
      const now = new Date();
      const startOfMinute = new Date(now.setSeconds(0, 0));
      const endOfMinute = new Date(now.setSeconds(59, 999));

      const justEndedAuctions = await this.bidProductRepository.find({
        where: {
          end_date: Between(startOfMinute, endOfMinute),
          deletedAt: null,
          isEnded: false,
        },
        relations: {
          bidParticipants: {
            user: {
              addresses: true,
            },
          },
          productDetail: {
            product: {
              brand: true,
              productPhotos: true,
            },
          },
        },
      });

      this.logger.debug(
        `Found ${justEndedAuctions.length} unprocessed auctions ending this minute`,
      );

      for (const auction of justEndedAuctions) {
        try {
          if (
            !auction.bidParticipants ||
            auction.bidParticipants.length === 0
          ) {
            this.logger.warn({
              msg: 'Auction ended with no participants',
              auctionId: auction.id,
              productId: auction.productDetail?.product?.id,
              endTime: auction.end_date,
            });

            await this.bidProductRepository.update(auction.id, {
              isEnded: true,
            });
            continue;
          }

          const highestBidder = auction.bidParticipants.reduce(
            (highest, current) => {
              if (!highest) return current;
              return highest.amount > current.amount ? highest : current;
            },
          );

          if (highestBidder) {
            this.logger.log({
              msg: 'Auction just ended - Winner determined',
              auctionId: auction.id,
              endTime: auction.end_date,
              productDetails: {
                id: auction.productDetail?.product?.id,
                name: auction.productDetail?.product?.name,
                brand: auction.productDetail?.product?.brand?.name,
              },
              winningBid: {
                amount: highestBidder.amount,
                timestamp: highestBidder.createdAt,
              },
              winner: {
                userId: highestBidder.user?.id,
                name: highestBidder.user?.name,
                email: highestBidder.user?.email,
                address: highestBidder.user?.defaultAddress,
              },
            });

            await this.bidProductRepository.update(auction.id, {
              isEnded: true,
            });
          }
        } catch (auctionError) {
          this.logger.error({
            msg: 'Error processing newly ended auction',
            error: auctionError,
            auctionId: auction.id,
            endTime: auction.end_date,
          });
        }
      }
    } catch (error) {
      this.logger.error({
        msg: 'Failed to process newly ended auctions',
        error,
      });
    }
  }

  async getBid(id: string) {
    return await this.bidProductRepository.findOneOrFail({
      where: { id },
      order: {
        bidParticipants: {
          amount: 'DESC',
        },
      },
      relations: {
        bidParticipants: {
          user: true,
        },
        productDetail: {
          product: {
            productPhotos: true,
            brand: true,
          },
        },
      },
    });
  }

  async getCheckoutData(res: any) {
    const cartItem = res.data.map((id: any) => id.id);
    const isFromCart = await this.userCartRepository.finditems(cartItem);

    if (isFromCart.length > 0) {
      return isFromCart;
    } else {
      const data = await this.productDetailRepository.findOneOrFail({
        where: { id: res.data[0].id },
        relations: {
          product: {
            brand: true,
            productPhotos: true,
          },
        },
      });

      return [
        {
          quantity: res.data[0].quantity,
          productDetailId: data.id,
          productDetail: data,
        },
      ];
    }
  }

  async checkoutToken(req: CartItem | any) {
    // const payload = {
    //   data,
    // };
    // return req.data

    return { checkout_token: this.jwtService.sign({ data: req.data }) };
  }

  async participateBid(body: any) {
    const [bidProduct, user] = await Promise.all([
      this.bidProductRepository.findOneOrFail({
        where: { id: body.bidProductId },
      }),
      this.userCartRepository.findEmail(body.userEmail),
    ]);

    const isBid = await this.bidParticipantRepository.findOne({
      where: {
        bidProductId: bidProduct.id,
        userId: user.id,
      },
    });

    if (!isBid) {
      await this.bidParticipantRepository.insert({
        bidProductId: bidProduct.id,
        userId: user.id,
        amount: body.bidAmount,
      });
    } else {
      await this.bidParticipantRepository.update(isBid.id, {
        amount: body.bidAmount,
      });
    }

    return isBid;
    // return await this.bidParticipantRepository.findOneOrFail({
    //   where: {
    //     id: result.identifiers[0].id,
    //   },
    //   relations: {
    //     bidProduct: {
    //       productDetail: {
    //         product: true,
    //       },
    //     },
    //     user: true,
    //   },
    // });
  }

  async addToBid(createBidProductDto: CreateBidProductDto) {
    const productDetail = await this.findProductDetail(
      createBidProductDto.productDetailId,
    );

    if (productDetail.stock - 1 >= 0) {
      await this.productDetailRepository.save({
        ...productDetail,
        stock: productDetail.stock - 1,
      });
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

    const result = await this.bidProductRepository.insert(createBidProductDto);
    return await this.bidProductRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        productDetail: {
          product: true,
        },
      },
    });
  }

  async findManyProductDetail(ids: string[]) {
    const categories = await Promise.all(
      ids.map(async (id) => {
        return await this.productDetailRepository.findOneOrFail({
          where: { id },
          relations: {
            product: true,
          },
        });
      }),
    );

    return categories;
  }

  async findProductBids() {
    return await this.bidProductRepository.find({
      relations: {
        productDetail: {
          product: {
            productPhotos: true,
            brand: true,
          },
        },
      },
    });
  }

  async findProductDetail(id: string) {
    return await this.productDetailRepository.findOneOrFail({
      where: { id },
      relations: {
        product: {
          brand: true,
          productPhotos: true,
        },
      },
    });
  }

  async addToCart(createCartItemDto: CreateCartItemDto) {
    const [productDetail, cart] = await Promise.all([
      this.findProductDetail(createCartItemDto.productDetailId),
      this.userCartRepository.findCart(createCartItemDto.cartId),
    ]);

    if (productDetail.stock - 1 < 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Bad Request.',
          message: 'Stock is not available.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const existingCartItem = cart.cartItems.find(
      (item) => item.productDetail.id === createCartItemDto.productDetailId,
    );

    if (existingCartItem) {
      if (
        existingCartItem.quantity + createCartItemDto.quantity ||
        1 > existingCartItem.productDetail.stock
      ) {
        await this.userCartRepository.updateCartItem(
          existingCartItem.id,
          existingCartItem.productDetail.stock,
        );
      } else {
        await this.userCartRepository.updateCartItem(
          existingCartItem.id,
          existingCartItem.quantity + createCartItemDto.quantity || 1,
        );
      }
    } else {
      createCartItemDto.quantity = createCartItemDto.quantity || 1;
      await this.userCartRepository.createCartItem(createCartItemDto);
    }

    // await this.productDetailRepository.save({
    //   ...productDetail,
    //   stock: productDetail.stock - 1,
    // });

    return { message: 'Item added to cart successfully.' };
  }

  async create(createProductDto: CreateProductDto) {
    const [brand, category] = await Promise.all([
      this.brandRepository.findOne(createProductDto.brandId),
      this.categoryRepository.findMany(createProductDto.categoryId),
    ]);
    const sizes = createProductDto.productDetails.map((detail) => detail.size);
    const hasDuplicate = sizes.some(
      (size, index) => sizes.indexOf(size) !== index,
    );
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

    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.brandId = createProductDto.brandId;
    product.categories = category;
    product.weight = createProductDto.weight;

    const result = await this.productRepository.insert(product);

    for (const [type, photos] of Object.entries(
      createProductDto.productPhotos,
    )) {
      if (Array.isArray(photos)) {
        for (const photoUrl of photos) {
          await this.productPhotoRepository.insert({
            image: photoUrl,
            photoType: PhotoType.SIDE,
            productId: result.identifiers[0].id,
          });
        }
      } else {
        await this.productPhotoRepository.insert({
          image: photos,
          photoType: type === 'front' ? PhotoType.FRONT : PhotoType.BOTTOM,
          productId: result.identifiers[0].id,
        });
      }
    }

    for (const detail of createProductDto.productDetails) {
      await this.productDetailRepository.insert({
        ...detail,
        productId: result.identifiers[0].id,
      });
    }

    await this.productRepository.save(product);
    return await this.productRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        brand: true,
        categories: true,
        productDetails: true,
        productPhotos: true,
      },
    });
  }

  async findNewest() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    return await this.productRepository.find({
      // where: {
      //   createdAt: Between(firstDayOfMonth, lastDayOfMonth),
      // },
      relations: {
        brand: true,
        categories: true,
        productDetails: true,
        productPhotos: true,
      },
    });
  }

  async findAll() {
    return await this.productRepository.find({
      relations: {
        brand: true,
        productDetails: true,
        categories: true,
        productPhotos: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async findName(param: string) {
    const brands = await this.brandRepository.findAll();

    const whereConditions = [];

    whereConditions.push({
      name: ILike(`%${param}%`),
    });

    for (const brand of brands) {
      const brandNameRegex = new RegExp(`^${brand.name}\\s+`, 'i');
      if (param.match(brandNameRegex)) {
        const nameWithoutBrand = param.replace(brandNameRegex, '').trim();
        whereConditions.push({
          name: ILike(`%${nameWithoutBrand}%`),
        });
      }
    }

    return await this.productRepository.findOneOrFail({
      where: whereConditions,
      relations: {
        brand: true,
        categories: true,
        productDetails: true,
        productPhotos: true,
      },
      order: {
        productDetails: {
          size: 'ASC',
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.productRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        brand: true,
        categories: true,
        productDetails: true,
      },
      order: {
        productDetails: {
          size: 'ASC',
        },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        productDetails: true,
        brand: true,
      },
    });

    const { categoryId, productDetails, ...updateProductData } =
      updateProductDto;

    Object.assign(product, updateProductData);

    const [brand, category] = await Promise.all([
      this.brandRepository.findOne(updateProductDto.brandId),
      this.categoryRepository.findMany(categoryId),
    ]);
    product.name = product.name;
    product.categories = category;

    await this.productRepository.save(product);

    for (const detail of productDetails) {
      const existingDetail = product.productDetails.find(
        (d) => d.size === detail.size,
      );

      if (existingDetail) {
        existingDetail.stock = detail.stock;
        await this.productDetailRepository.update(existingDetail.id, {
          stock: detail.stock,
        });
      } else {
        await this.productDetailRepository.insert({
          ...detail,
          productId: product.id,
        });
      }
    }
    return await this.productRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        brand: true,
        categories: true,
        productDetails: true,
      },
    });
  }

  async remove(id: string) {
    await this.productRepository.findOneOrFail({
      where: { id },
    });

    await this.productRepository.softDelete(id);
  }
}
