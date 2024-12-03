import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) { }

  async create(createPaymentDto: CreatePaymentDto) {
    const result = await this.paymentRepository.insert(createPaymentDto);

    return await this.paymentRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id
      }
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    return await this.paymentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    })
  }

  async findOne(id: string) {
    return await this.paymentRepository.findOneOrFail({
      where: { id }
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepository.findOneOrFail({
      where: { id },
    });

    await this.paymentRepository.update(id, updatePaymentDto);
    return await this.paymentRepository.findOneOrFail({
      where: { id },
    });
  }


  async remove(id: string) {
    await this.paymentRepository.findOneOrFail({
      where: { id },
    });

    await this.paymentRepository.softDelete(id);
  }
}
