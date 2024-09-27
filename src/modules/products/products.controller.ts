import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return {
      data: await this.productsService.create(createProductDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    };
  }

  @Get()
  async findAll() {
    const [data, count] = await this.productsService.findAll();

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
      data: await this.productsService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateProductDto,
  ) {
    return {
      data: await this.productsService.update(id, updateCategoryDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productsService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
