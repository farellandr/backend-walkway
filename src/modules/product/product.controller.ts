import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, DefaultValuePipe, ParseIntPipe, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CreateBidProductDto } from './dto/create-bid-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImageHelper } from '#/utils/helpers/upload-helper';
import { capitalizeWords } from '#/utils/helpers/capitalizer';
import { of } from 'rxjs';
import { join } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return {
      data: await this.productService.create(createProductDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Get('/uploads/:image')
  getImage(@Param('image') imagePath: string, @Res() res: any) {
    return of(
      res.sendFile(
        join(process.cwd(), `/uploads/images/product-images/${imagePath}`),
      ),
    );
  }

  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('image', uploadImageHelper('product-images')),
  )
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('Product image is not uploaded');
    }

    return {
      imageUrl: image?.filename,
    };
  }

  @Post('/add-to-cart')
  async addToCart(@Body() createCartItemDto: CreateCartItemDto) {
    return {
      data: await this.productService.addToCart(createCartItemDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }
  @Post('/add-to-bid')
  async addToBid(@Body() createBidProductDto: CreateBidProductDto) {
    return {
      data: await this.productService.addToBid(createBidProductDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }
  @Post('/participate-bid')
  async participateBid(@Body() body: any) {
    return {
      data: await this.productService.participateBid(body),
      statusCode: HttpStatus.CREATED,
      message: 'success',
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
      data: await this.productService.findAll(page, limit),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':param')
  async findName(@Param('param') param: string) {
    const formattedName = capitalizeWords(param.replace(/-/g, ' '));

    const product = await this.productService.findName(formattedName);

    const productImages = product.productPhotos.map((photo) => {
      return `http://localhost:3222/product/uploads/${photo.image}`;
    });

    return {
      data: { ...product, productImages },
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.productService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return {
      data: await this.productService.update(id, updateProductDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
