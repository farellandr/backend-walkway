import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const result = await this.roleRepository.insert(createRoleDto);

    return await this.roleRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id
      }
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    return await this.roleRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    })
  }

  async findByName(name: string) {
    return await this.roleRepository.findOneOrFail({
      where: { name }
    });
  }

  async findOne(id: string) {
    return await this.roleRepository.findOneOrFail({
      where: { id }
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.findOneOrFail({
      where: { id },
    });

    await this.roleRepository.update(id, updateRoleDto);
    return await this.roleRepository.findOneOrFail({
      where: { id },
    });
  }


  async remove(id: string) {
    await this.roleRepository.findOneOrFail({
      where: { id },
    });

    await this.roleRepository.softDelete(id);
  }
}
