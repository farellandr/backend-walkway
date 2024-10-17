import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, DefaultValuePipe, ParseIntPipe, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImageHelper } from '#/utils/helpers/upload-helper';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return {
      data: await this.brandService.create(createBrandDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    }
  }

  @Post('/upload/logo')
  @UseInterceptors(FileInterceptor('image', uploadImageHelper('brand-logo')))
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (typeof image === 'undefined') {
      throw new BadRequestException('Flag image is not uploaded');
    }

    return {
      flagImage: image?.filename,
    };
  }

  @Get()
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number) {
    return {
      page, limit,
      data: await this.brandService.findAll(page, limit),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.brandService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return {
      data: await this.brandService.update(id, updateBrandDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.brandService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
