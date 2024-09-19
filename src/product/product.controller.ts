import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    HttpStatus,
  } from '@nestjs/common';
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create.product.dto";
import { upDataBrand } from '#/data-brand/dto/updateDataBrand.dto';
import { UpProduct } from './dto/update.product.dto';

@Controller('product')
export class ProductController {

  constructor(
    private readonly productService: ProductService
  ){}

  @Post()
  async createProduct(@Body() createproductDto: CreateProductDto){
    return{
      data: await this.productService.createProduct(createproductDto),
      statusCode: HttpStatus.CREATED,
      massage: 'Data Success'
    }
  }

  @Get()
  async findAll(){
    const [data, count] = await this.productService.findAll();

    return{
      data, count, 
      statusCode: HttpStatus.OK, 
      massage: 'Success'
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string){
    return{
      data: await this.productService.findOne(id),
      statusCode: HttpStatus.OK,
      massage: 'Success'
    }
  }

  @Put(':id')
  async edit(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() upProduct: UpProduct ){
    return{
      data: await this.productService.update(id, upProduct),
      statusCode: HttpStatus.OK,
      massage: "Success"
    }
  }

  @Delete(':id')
  async remove(@Param('id') id:string ){
    return{
      data: await this.productService.hapus(id),
      statusCode: HttpStatus.OK,
      massage: "Success"
    }
  }
}
