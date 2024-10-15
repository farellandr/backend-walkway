import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';
import { CommonErrorHandler } from '#/utils/helpers/error-handler';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>
  ) { }

  async create(createBrandDto: CreateBrandDto) {
    try {
      const result = await this.brandRepository.insert(createBrandDto);

      return await this.brandRepository.findOneOrFail({
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
      return await this.brandRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.brandRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      await this.brandRepository.findOneOrFail({
        where: { id },
      });

      await this.brandRepository.update(id, updateBrandDto);
      return await this.brandRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }


  async remove(id: string) {
    try {
      await this.brandRepository.findOneOrFail({
        where: { id },
      });

      await this.brandRepository.softDelete(id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
