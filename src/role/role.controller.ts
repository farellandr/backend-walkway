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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return {
      data: await this.roleService.create(createRoleDto),
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.roleService.findAll(),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.roleService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return {
      data: await this.roleService.update(id, updateRoleDto),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.roleService.remove(id),
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }
}
