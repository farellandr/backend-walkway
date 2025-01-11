import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    await this.brandRepository.save(brand);

    const image = this.imageRepository.create({
      filename: createBrandDto.logo,
      brand: brand,
    });
    await this.imageRepository.save(image);

    return await this.brandRepository.findOneOrFail({
      where: { id: brand.id },
      relations: ['image'],
    });
  }

  async findAll() {
    return await this.brandRepository.find({
      relations: ['image'],
    });
  }

  async findOne(id: string) {
    return await this.brandRepository.findOneOrFail({
      where: { id },
      relations: ['products.images', 'image'],
    });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.findOneOrFail({
      where: { id },
      relations: ['image'],
    });

    const updatedBrand = this.brandRepository.create({
      ...brand,
      name: updateBrandDto.name,
      status: updateBrandDto.status,
    });
    await this.brandRepository.save(updatedBrand);

    if (updateBrandDto.logo !== brand.image.filename) {
      const image = await this.imageRepository.findOne({
        where: { filename: brand.image.filename },
      });

      await this.imageRepository.save({
        ...image,
        filename: updateBrandDto.logo,
      });
    }

    return await this.brandRepository.findOneOrFail({
      where: { id: updatedBrand.id },
      relations: ['image'],
    });
  }

  async remove(id: string) {
    await this.brandRepository.findOneOrFail({ where: { id } });

    await this.brandRepository.softDelete(id);
  }
}
