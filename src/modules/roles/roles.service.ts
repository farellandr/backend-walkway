import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { role: createRoleDto.role },
    });

    if (role) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Role ${createRoleDto.role} already exists`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newRole = await this.roleRepository.insert(createRoleDto);

    return this.roleRepository.findOneOrFail({
      where: {
        id: newRole.identifiers[0].id,
      },
    });
  }

  findAll() {
    return this.roleRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.roleRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async findByName(roleName: string) {
    return this.roleRepository.findOneOrFail({
      where: {
        role: roleName,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      await this.findOne(id);
      await this.roleRepository.update(id, updateRoleDto);

      return this.roleRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.roleRepository.softDelete(id);
    } catch (e) {
      throw e;
    }
  }
}
