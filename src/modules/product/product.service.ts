import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { Image } from '../image/entities/image.entity';
import { Size } from '../sizes/entities/size.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const brand = await this.brandRepository.findOneOrFail({
      where: { name: createProductDto.brand },
    });

    const categories = await Promise.all(
      createProductDto.categories.map(async (categoryName) => {
        let category = await this.categoryRepository.findOne({
          where: { name: categoryName },
        });

        if (!category) {
          category = await this.categoryRepository.save({
            name: categoryName,
          });
        }

        return category;
      }),
    );

    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      brand: brand,
      categories: categories,
      status: createProductDto.status,
    });
    await this.productRepository.save(product);

    const images = createProductDto.images.map((filename) => {
      return this.imageRepository.create({
        filename: filename,
        product: product,
      });
    });
    await this.imageRepository.save(images);

    const sizes = createProductDto.sizes.map((size) => {
      return this.sizeRepository.create({
        size: size.size,
        stock: size.stock,
        product: product,
      });
    });
    await this.sizeRepository.save(sizes);

    return await this.productRepository.findOneOrFail({
      where: { id: product.id },
    });
  }

  async findAll() {
    return await this.productRepository.find({
      relations: ['brand.image', 'categories', 'images'],
    });
  }

  async findOne(id: string) {
    return await this.productRepository.findOneOrFail({
      where: { id },
      relations: ['brand.image', 'categories', 'images', 'sizes'],
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: ['brand', 'categories', 'images', 'sizes'],
    });

    const brand = await this.brandRepository.findOneOrFail({
      where: { name: updateProductDto.brand },
    });

    const categories = await Promise.all(
      updateProductDto.categories.map(async (categoryName) => {
        let category = await this.categoryRepository.findOne({
          where: { name: categoryName },
        });

        if (!category) {
          category = await this.categoryRepository.save({
            name: categoryName,
          });
        }

        return category;
      }),
    );

    const updatedProduct = this.productRepository.create({
      ...product,
      name: updateProductDto.name,
      price: updateProductDto.price,
      status: updateProductDto.status,
      brand: brand,
      categories: categories,
    });
    await this.productRepository.save(updatedProduct);

    const sizes = await Promise.all(
      updateProductDto.sizes.map(async (size) => {
        const existingSize = await this.sizeRepository.findOneOrFail({
          where: {
            product: updatedProduct,
            size: size.size,
          },
        });

        const updatedSize = this.sizeRepository.create({
          ...existingSize,
          stock: size.stock,
        });
        await this.sizeRepository.save(updatedSize);
      }),
    );

    const images = await Promise.all(
      updateProductDto.images.map(async (filename) => {
        const existingImage = await this.imageRepository.findOneOrFail({
          where: {
            product: updatedProduct,
          },
        });
        const image = this.imageRepository.create({
          ...existingImage,
          filename: filename,
          product: updatedProduct,
        });
        await this.imageRepository.save(image);
      }),
    );
  }

  async remove(id: string) {
    await this.productRepository.findOneOrFail({ where: { id } });

    await this.productRepository.softDelete(id);
  }
}
