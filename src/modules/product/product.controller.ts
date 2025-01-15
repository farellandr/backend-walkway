import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return {
      data: await this.productService.create(createProductDto),
      statusCode: HttpStatus.CREATED,
      message: 'Product created successfully',
    };
  }

  @Get()
  async findAll(@Query() queryDto: ProductQueryDto) {
    return {
      data: await this.productService.findAll(queryDto),
      statusCode: HttpStatus.OK,
      message: 'Products fetched successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.productService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'Product fetched successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return {
      data: await this.productService.update(id, updateProductDto),
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Product deleted successfully',
    };
  }
}
