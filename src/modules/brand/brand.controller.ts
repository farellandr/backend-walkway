import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return {
      data: await this.brandService.create(createBrandDto),
      statusCode: HttpStatus.CREATED,
      message: 'Brand created successfully',
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.brandService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Brands fetched successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.brandService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'Brand fetched successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return {
      data: await this.brandService.update(id, updateBrandDto),
      statusCode: HttpStatus.OK,
      message: 'Brand updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Brand deleted successfully',
    };
  }
}
