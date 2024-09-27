import { Controller, Get, Post, Body, Param, Delete, HttpStatus, ParseUUIDPipe, Put } from '@nestjs/common';
import { BidProductsService } from './bid-products.service';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { UpdateBidProductDto } from './dto/update-bid-product.dto';

@Controller('bids')
export class BidProductsController {
  constructor(private readonly bidProductsService: BidProductsService) { }

  @Post()
  async create(@Body() createBidProductDto: CreateBidProductDto) {
    return {
      data: await this.bidProductsService.create(createBidProductDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    };
  }

  @Get()
  async findAll() {
    const [data, count] = await this.bidProductsService.findAll();

    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.bidProductsService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBidProductDto: UpdateBidProductDto,
  ) {
    return {
      data: await this.bidProductsService.update(id, updateBidProductDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bidProductsService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
