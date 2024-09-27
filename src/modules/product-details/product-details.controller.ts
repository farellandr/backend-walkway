import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, Put } from '@nestjs/common';
import { ProductDetailsService } from './product-details.service';
import { CreateProductDetailDto } from './dto/create-product-detail.dto';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';

@Controller('product-details')
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Post()
  async create(@Body() createProductDetailDto: CreateProductDetailDto) {
    return {
      data: await this.productDetailsService.create(createProductDetailDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    };
  }

  @Get()
  async findAll() {
    const [data, count] = await this.productDetailsService.findAll();

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
      data: await this.productDetailsService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDetailDto: UpdateProductDetailDto,
  ) {
    return {
      data: await this.productDetailsService.update(id, updateProductDetailDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productDetailsService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
