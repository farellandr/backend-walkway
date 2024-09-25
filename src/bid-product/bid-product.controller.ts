import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BidProductService } from './bid-product.service';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { UpdateBidProductDto } from './dto/update-bid-product.dto';
import { HttpStatusCode } from 'axios';

@Controller('bid-product')
export class BidProductController {
  constructor(private readonly bidProductService: BidProductService) {}

  @Post()
  async create(@Body() createBidProductDto: CreateBidProductDto) {
    return {
      data: await this.bidProductService.createBid(createBidProductDto),
      statuCode: HttpStatusCode.Created,
      massage: 'Data Added'
    }
  }

  @Get()
  async findAll() {
    const [data, count] = await this.bidProductService.findAll()
    return {
      data: await this.bidProductService.findAll(),
      statusCode: HttpStatusCode.Ok,
      massage: 'Success'
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.bidProductService.findOne(id),
      statusCode: HttpStatusCode.Ok,
      massage: 'Sucsess'
    }
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBidProductDto: UpdateBidProductDto) {
    return { 
      data: await this.bidProductService.updateBid(id, updateBidProductDto),
      statusCode: HttpStatusCode.Ok,
      massage: 'Success'
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.bidProductService.remove(id),
      statusCode: HttpStatusCode.Ok,
      massage: 'Success Deleted'
    }
  }
}
