import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const result = await this.brandRepository.insert(createBrandDto);

    return await this.brandRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  async findMany() {
    return await this.brandRepository.find({ take: 6 });
  }

  async findAll(page: number = 1, limit: number = 10) {
    return await this.brandRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findName(name: string) {
    return await this.brandRepository.findOneOrFail({
      where: { name },
      relations: {
        products: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.brandRepository.findOneOrFail({
      where: { id },
    });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.brandRepository.findOneOrFail({
      where: { id },
    });

    await this.brandRepository.update(id, updateBrandDto);
    return await this.brandRepository.findOneOrFail({
      where: { id },
    });
  }

  async remove(id: string) {
    await this.brandRepository.findOneOrFail({
      where: { id },
    });

    await this.brandRepository.softDelete(id);
  }
}
