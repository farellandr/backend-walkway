import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  findOneOrFail(arg0: { where: { id: string } }) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
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
