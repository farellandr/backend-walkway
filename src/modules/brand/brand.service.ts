import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

function cleanErrorMessage(message: string): string {
  return message
    .replace(/[\n\s]+/g, ' ')
    .replace(/"where":\s*{[^}]*"id":\s*"([^"]+)"[^}]*}/, 'id: $1')
    .replace(/\\*"/g, "'")
    .trim();
}

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
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.brandRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

    }
  }

  async findOne(id: string) {
    try {
      return await this.brandRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


  async remove(id: string) {
    try {
      await this.brandRepository.findOneOrFail({
        where: { id },
      });

      await this.brandRepository.softDelete(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
