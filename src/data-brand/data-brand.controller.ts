import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, Put } from '@nestjs/common';
import { DataBrandService } from "./data-brand.service";
import { CreateBrandDto } from "./dto/createDataBrand.dto";
import { upDataBrand } from './dto/updateDataBrand.dto';


@Controller('data-brand')
export class DataBrandController {
    constructor(private readonly brandService: DataBrandService){}

    @Post()
    async create(@Body() createBrandDto: CreateBrandDto){
        return{
            data:await this.brandService.create(createBrandDto),
            status: HttpStatus.CREATED,
            massage: 'Success Add Table'
        }
    }

    @Get(':id')
    async findAll(@Query('page') page:number, @Query('page_size') page_size: number){
        return{
            data: await this.brandService.findAll(page, page_size),
            status: HttpStatus.OK,
            massage: 'Success'
        }
    }

    @Get(':id')
    async findOne(@Param('id') id:string){
        return{
            data: await this.brandService.findOneDept(id),
            statusCode: HttpStatus.OK,
            massage: 'Success'
        }
    }

    @Patch(':id')
    async update(@Param('id') id:string, @Body() updataBrand: upDataBrand){
        return{
            data: await this.brandService.edit(id, updataBrand),
            statusCode: HttpStatus.OK,
            massage: 'Success'
        }
    }

    @Delete(':id')
    async hapus(@Param('id') id:string){
        return{
            data: await this.brandService.remove(id),
            statusCode: HttpStatus.OK,
            massage: 'Success'
        }
    }
}
