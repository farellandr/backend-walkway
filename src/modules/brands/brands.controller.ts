import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, Put } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return {
      data: await this.brandsService.create(createBrandDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    };
  }

  @Get()
  async findAll() {
    const [data, count] = await this.brandsService.findAll();

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
      data: await this.brandsService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return {
      data: await this.brandsService.update(id, updateBrandDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.brandsService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
