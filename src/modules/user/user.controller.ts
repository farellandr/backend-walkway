import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, DefaultValuePipe, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.userService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    }
  }

  @Post('add-address')
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    return {
      data: await this.userService.createAddress(createAddressDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    }
  }

  @Patch('/edit-address')
  async updateAddress(@Body() updateAddressDto: UpdateAddressDto) {
    return {
      data: await this.userService.updateAddress(updateAddressDto),
      statusCode: HttpStatus.CREATED,
      message: 'success'
    }
  }

  @Delete('/remove/:id')
  async removeAddress(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.removeAddress(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get()
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number) {
    return {
      page, limit,
      data: await this.userService.findAll(page, limit),
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.userService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      data: await this.userService.update(id, updateUserDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Patch('change-password/:id')
  async updatePass(@Param('id', ParseUUIDPipe) id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return {
      data: await this.userService.updatePassword(id, updatePasswordDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
