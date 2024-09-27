import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) { }

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    return {
      data: await this.addressesService.create(createAddressDto),
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.addressesService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.addressesService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return {
      data: await this.addressesService.update(id, updateAddressDto),
      statusCode: HttpStatus.OK,
      essage: 'Success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.addressesService.remove(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }
}
