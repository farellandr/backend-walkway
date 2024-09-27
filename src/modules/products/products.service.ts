import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { ProductDetailsService } from '../product-details/product-details.service';
import { ProductDetail } from '../product-details/entities/product-detail.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private brandRepository: BrandsService,
    private categoryRepository: CategoriesService,
    private productDetailRepository: ProductDetailsService
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { categories, brand, details, ...productData } = createProductDto;

    const product = new Product;
    product.name = productData.name;
    product.price = productData.price

    const productBrand = await this.brandRepository.findOne(brand)
    if (!productBrand) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Brand not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    product.brand = productBrand

    const productCategories = await this.categoryRepository.findMany(categories)
    if (productCategories.length !== categories.length) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Some categories not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    product.categories = productCategories

    const result = await this.productRepository.insert(product)
    details.map(async (detail) => {
      const productDetail = new ProductDetail;
      productDetail.size = detail.size;
      productDetail.stock = detail.stock;
      productDetail.product = product;
      
      return await this.productDetailRepository.create(productDetail)
    })
    await this.productRepository.save(product)

    return this.productRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        categories: true,
        brand: true,
        details: true
      },
    });
  }

  findAll() {
    return this.productRepository.findAndCount({
      relations: {
        categories: true,
        brand: true,
        details: true
      }
    });
  }

  async findOne(id: string) {
    try {
      return await this.productRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          categories: true,
          brand: true,
          details: true
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
      await this.productRepository.findOneOrFail({
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

    const { categories, brand, ...updateData } = updateProductDto;

    const product = await this.productRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        categories: true,
        brand: true,
        details: true
      },
    });
    Object.assign(product, updateData);

    if (categories) {
      const productCategories = await this.categoryRepository.findMany(categories);

      if (productCategories.length !== categories.length) {
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

    if (brand) {
      const productBrand = await this.brandRepository.findOne(brand)
      if (!productBrand) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Brand not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      product.brand = productBrand
    }

    await this.productRepository.save(product);
    return this.productRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        categories: true,
        brand: true,
        details: true
      },
    });
  }

  async remove(id: string) {
    try {
      await this.productRepository.findOneOrFail({
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

    await this.productRepository.softDelete(id);
  }
}
