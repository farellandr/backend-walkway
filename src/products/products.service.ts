import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CategoriesService } from '#/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoryRepository: CategoriesService
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, ...productData } = createProductDto;

    const productCategories = await this.categoryRepository.findMany(categoryIds);

    const result = await this.productsRepository.insert({
      ...productData,
    });

    const product = await this.productsRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });

    if (categoryIds) {
      const productCategories = await this.categoryRepository.findMany(categoryIds);
  
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

    await this.productsRepository.save(product);

    return this.productsRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: ['categories'],
    });
  }


  findAll() {
    return this.productsRepository.findAndCount({ relations: { categories: true } });
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

    const { categoryIds, ...updateData } = updateProductDto;

    const product = await this.productsRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['categories'],
    });

    Object.assign(product, updateData);

    if (categoryIds) {
      const productCategories = await this.categoryRepository.findMany(categoryIds);
  
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

    await this.productsRepository.save(product);

    return this.productsRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['categories'],
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
