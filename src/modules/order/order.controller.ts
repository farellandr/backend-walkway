import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Request,
  Res,
  NotFoundException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Response } from 'express';
import * as dayjs from 'dayjs';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Post()
  // async create(@Body() createOrderDto: CreateOrderDto) {
  //   return {
  //     data: await this.orderService.create(createOrderDto),
  //     statusCode: HttpStatus.CREATED,
  //     message: 'success'
  //   }
  // }

  @Get('export/excel')
  async exportOrderExcel(
    @Res() res: Response,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    try {
      const startOfMonth = dayjs(`${year}-${month}-01`)
        .startOf('month')
        .toISOString();
      const endOfMonth = dayjs(`${year}-${month}-01`)
        .endOf('month')
        .toISOString();

      await this.orderService.generateExcel(res, startOfMonth, endOfMonth);
    } catch (error) {
      console.error('Export error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to generate Excel report');
    }
  }

  @Get('export/:orderId')
  async exportOrderDetail(
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.orderService.generateOrderDetailPDF(
        orderId,
        res,
      );

      return pdfBuffer;
    } catch (error) {
      console.error('Export error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/payment')
  async midtransNotification(@Request() req: any) {
    return await this.orderService.paymentHandler(req.body);
  }

  @Post('/rates')
  async getCourierRate(@Body() data: any) {
    return {
      data: await this.orderService.getRate(data),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Post('/generate-link')
  async genLink(@Body() data: any) {
    return {
      data: await this.orderService.genPaymentLink(data),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Post('/generate-token')
  async genToken(@Body() data: any) {
    return {
      data: await this.orderService.genPaymentToken(data),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Post('/generate-token-bid')
  async genBidToken(@Body() data: any) {
    return {
      data: await this.orderService.genBidPaymentToken(data),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
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
