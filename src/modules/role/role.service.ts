import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';
import { CommonErrorHandler } from '#/utils/helpers/error-handler';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      const result = await this.roleRepository.insert(createRoleDto);

      return await this.roleRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.roleRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findByName(name: string) {
    try {
      return await this.roleRepository.findOneOrFail({
        where: { name }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.roleRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      await this.roleRepository.findOneOrFail({
        where: { id },
      });

      await this.roleRepository.update(id, updateRoleDto);
      return await this.roleRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }


  async remove(id: string) {
    try {
      await this.roleRepository.findOneOrFail({
        where: { id },
      });

      await this.roleRepository.softDelete(id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
