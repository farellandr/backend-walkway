import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Get()
  async findAll() {
    return {
      data: this.categoryService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Categories fetched successfully'
    };
  }
}
