import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const result = await this.orderRepository.insert(createOrderDto);

      return await this.orderRepository.findOneOrFail({
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
      return await this.orderRepository.findAndCount({
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
      return await this.orderRepository.findOneOrFail({
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

  async findMany(ids: string[]) {
    try {
      const categories = await Promise.all(
        ids.map(async (id) => {
          return await this.orderRepository.findOneOrFail({
            where: { id }
          });
        })
      );
  
      return categories;  
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      await this.orderRepository.findOneOrFail({
        where: { id },
      });

      await this.orderRepository.update(id, updateOrderDto);
      return await this.orderRepository.findOneOrFail({
        where: { id },
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
      await this.orderRepository.findOneOrFail({
        where: { id },
      });

      await this.orderRepository.softDelete(id);
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
