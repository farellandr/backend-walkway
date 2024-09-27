import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) { }

  async create(createBrandDto: CreateBrandDto) {
    const result = await this.brandRepository.insert(createBrandDto);

    return this.brandRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      }
    })
  }

  findAll() {
    return this.brandRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.brandRepository.findOneOrFail({
        where: {
          id,
        }
      })
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

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      await this.brandRepository.findOneOrFail({
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

    await this.brandRepository.update(id, updateBrandDto);

    return this.brandRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.brandRepository.findOneOrFail({
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

    await this.brandRepository.softDelete(id);
  }
}
