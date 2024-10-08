import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, DefaultValuePipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return {
      data: await this.categoryService.create(createCategoryDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    }
  }

  @Get()
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number) {
    return {
      page, limit,
      data: await this.categoryService.findAll(page, limit),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.categoryService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return {
      data: await this.categoryService.update(id, updateCategoryDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
