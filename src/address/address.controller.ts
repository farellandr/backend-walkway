import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    return {
      data: await this.addressService.create(createAddressDto),
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.addressService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.addressService.findOne(id),
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
      data: await this.addressService.update(id, updateAddressDto),
      statusCode: HttpStatus.OK,
      essage: 'Success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.addressService.remove(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }
}
