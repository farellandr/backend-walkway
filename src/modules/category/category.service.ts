import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryrepository: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryrepository.insert(createCategoryDto);

    return await this.categoryrepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id
      }
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    return await this.categoryrepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    });
  }

  async findOne(id: string) {
    return await this.categoryrepository.findOneOrFail({
      where: { id }
    });
  }

  async findMany(ids: string[]) {
    return await Promise.all(
      ids.map(async (id) => {
        return await this.categoryrepository.findOneOrFail({
          where: { id }
        });
      })
    );
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryrepository.findOneOrFail({
      where: { id },
    });

    await this.categoryrepository.update(id, updateCategoryDto);
    return await this.categoryrepository.findOneOrFail({
      where: { id },
    });
  }

  async remove(id: string) {
    await this.categoryrepository.findOneOrFail({
      where: { id },
    });

    await this.categoryrepository.softDelete(id);
  }
}
