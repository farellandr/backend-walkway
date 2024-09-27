import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private userRepository: UsersService
  ) { }

  async create(createPaymentDto: CreatePaymentDto) {
    const { user, ...paymentData } = createPaymentDto
    const getUser = await this.userRepository.findOne(user)

    const result = await this.paymentRepository.insert({ ...paymentData, user: getUser })
    return this.paymentRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        user: true
      }
    });;
  }

  findAll() {
    return this.paymentRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.paymentRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw error;
      }
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const { user, ...addressData } = updatePaymentDto
    const getUser = await this.userRepository.findOne(user)

    await this.paymentRepository.update(id, { ...addressData, user: getUser })
    return this.paymentRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        user: true
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id)

    await this.paymentRepository.softDelete(id);
  }
}
