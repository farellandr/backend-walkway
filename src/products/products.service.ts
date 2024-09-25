import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CategoriesService } from '#/categories/categories.service';
import { ProductDetailsService } from '#/product_details/product_details.service';
import { ProductDetail } from '#/product_details/entities/product_detail.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesRepository: CategoriesService,
    private productDetailsRepository: ProductDetailsService
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { categoryIds, details, ...productData } = createProductDto;

    const product = new Product;
    product.name = productData.name;
    product.price = productData.price

    const productCategories = await this.categoriesRepository.findMany(categoryIds)
    if (productCategories.length !== categoryIds.length) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Some categories not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    product.categories = productCategories

    const result = await this.productsRepository.insert(product)

    details.map(async (detail) => {
      const productDetail = new ProductDetail;
      productDetail.size = detail.size;
      productDetail.stock = detail.stock;
      productDetail.product = result.identifiers[0].id;

      return await this.productDetailsRepository.create(productDetail)
    })

    await this.productsRepository.save(product)

    return this.productsRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        categories: true,
        productDetails: true,
      },
    });
  }

  findAll() {
    return this.productsRepository.findAndCount({ relations: { categories: true, productDetails: true } });
  }

  async findOne(id: string) {
    try {
      return await this.productsRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          categories: true
        }
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
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      await this.productsRepository.findOneOrFail({
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

    const { categoryIds, details, ...updateData } = updateProductDto;

    const product = await this.productsRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        categories: true,
        productDetails: true
      },
    });

    Object.assign(product, updateData);

    if (categoryIds) {
      const productCategories = await this.categoriesRepository.findMany(categoryIds);

      if (productCategories.length !== categoryIds.length) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Some categories not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      product.categories = productCategories;
    }

    if (details && details.length > 0) {
      for (const detail of details) {
        const existingDetail = product.productDetails.find((d) => d.size === detail.size);

        if (existingDetail) {
          existingDetail.stock = detail.stock;
          await this.productDetailsRepository.update(existingDetail.id, { stock: detail.stock });
        } else {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              error: `Size ${detail.size} not found for this product, cannot add new size during update`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    await this.productsRepository.save(product);

    return this.productsRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        categories: true,
        productDetails: true
      },
    });
  }

  async remove(id: string) {
    try {
      await this.productsRepository.findOneOrFail({
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

    await this.productsRepository.delete(id);
  }
}
