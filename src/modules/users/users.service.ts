import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { hash, genSalt } from 'bcrypt';
import { DEFAULT_ROLE } from '#/common/constants/user.constants';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleRepository: RolesService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User;
      user.name = createUserDto.name
      user.phoneNumber = createUserDto.phoneNumber

      const isEmailTaken = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        }
      });
      if (isEmailTaken) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: `Email ${createUserDto.email} already exists. Please try a different one.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      user.email = createUserDto.email

      const salt = await genSalt(10);
      const hashedPass = await hash(createUserDto.password, salt);
      user.salt = salt
      user.password = hashedPass

      const role = await this.roleRepository.findByName(createUserDto.role)
      user.role = role

      const result = await this.userRepository.insert(user);
      return this.userRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.userRepository.findAndCount({ relations: { role: true, addresses: true } });
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        role: true
      }
    });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { role, password, ...userData } = updateUserDto;
    Object.assign(user, userData);

    const newPassword = await bcrypt.hash(password, user.salt);
    user.password = newPassword

    await this.userRepository.update(id, user);
    return this.userRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        role: true
      }
    });
  }

  async remove(id: string) {
    try {
      await this.userRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.userRepository.softDelete(id);
  }
}
