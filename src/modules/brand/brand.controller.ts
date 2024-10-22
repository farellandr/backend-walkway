import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  HttpException,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImageHelper } from '#/utils/helpers/upload-helper';
import { of } from 'rxjs';
import { join } from 'path';
import { capitalizeWords } from '#/utils/helpers/capitalizer';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return {
      data: await this.brandService.create(createBrandDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', uploadImageHelper('brand-logos')))
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request.',
          message: 'An error occurred while uploading image.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      imageUrl: image?.filename,
    };
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return {
      page,
      limit,
      data: await this.brandService.findAll(page, limit),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get('/recent')
  async findMany() {
    const brands = await this.brandService.findMany();

    const formattedBrands = brands.map((brand) => ({
      ...brand,
      image: `http://localhost:3222/brand/uploads/${brand.image}`,
    }));
    return {
      data: formattedBrands,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get('/uploads/:image')
  getImage(@Param('image') imagePath: string, @Res() res: any) {
    return of(
      res.sendFile(
        join(process.cwd(), `/uploads/images/brand-logos/${imagePath}`),
      ),
    );
  }

  @Get(':name')
  async findName(@Param('name') name: string) {
    const formattedName = capitalizeWords(name.replace(/-/g, ' '));
    return {
      data: await this.brandService.findName(formattedName),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
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
