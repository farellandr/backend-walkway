import { Controller, Get, Post, Body, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return {
      data: await this.rolesService.create(createRoleDto),
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.rolesService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.rolesService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return {
      data: await this.rolesService.update(id, updateRoleDto),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.rolesService.remove(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }
}
