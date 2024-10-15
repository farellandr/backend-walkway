import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';
import { CommonErrorHandler } from '#/utils/helpers/error-handler';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryrepository: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const result = await this.categoryrepository.insert(createCategoryDto);

      return await this.categoryrepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.categoryrepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.categoryrepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findMany(ids: string[]) {
    try {
      const categories = await Promise.all(
        ids.map(async (id) => {
          return await this.categoryrepository.findOneOrFail({
            where: { id }
          });
        })
      );
  
      return categories;  
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryrepository.findOneOrFail({
        where: { id },
      });

      await this.categoryrepository.update(id, updateCategoryDto);
      return await this.categoryrepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }


  async remove(id: string) {
    try {
      await this.categoryrepository.findOneOrFail({
        where: { id },
      });

      await this.categoryrepository.softDelete(id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
