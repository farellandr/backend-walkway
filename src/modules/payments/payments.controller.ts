import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return {
      data: await this.paymentsService.create(createPaymentDto),
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.paymentsService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.paymentsService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return {
      data: await this.paymentsService.update(id, updatePaymentDto),
      statusCode: HttpStatus.OK,
      essage: 'Success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.paymentsService.remove(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }
}
