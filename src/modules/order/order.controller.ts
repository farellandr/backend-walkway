import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return {
      data: await this.orderService.create(createOrderDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    }
  }
  @Get()
  async findAll() {
    return {
      data: await this.orderService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.orderService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
