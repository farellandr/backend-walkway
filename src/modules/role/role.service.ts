import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const result = await this.roleRepository.insert(createRoleDto);

      return await this.roleRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        }
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.roleRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit
      })
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

    }
  }

  async findOne(id: string) {
    try {
      return await this.roleRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else if (error instanceof QueryFailedError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database query failed.',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


  async remove(id: string) {
    try {
      await this.roleRepository.findOneOrFail({
        where: { id },
      });

      await this.roleRepository.softDelete(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
