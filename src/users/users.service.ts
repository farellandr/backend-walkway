import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, genSalt } from 'bcrypt';
import { RoleService } from '#/role/role.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // cek apakah role ada didalam roleRepository
      const role = await this.roleService.findByName(createUserDto.roleName);

      if (!role) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'The requested role is not available',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cek apakah email sudah pernah digunakan
      const cekEmail = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (cekEmail) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: `Email ${createUserDto.email} already exists. Please try a different one.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generate salt & hash password
      const salt = await genSalt(10);
      const hashedPass = await hash(createUserDto.password, salt);

      // Menyediakan apa saja yang akan di masukan kedalam database
      const user = {
        ...createUserDto,
        password: hashedPass,
        salt,
      };

      // Memasukan ke dalam database
      const result = await this.usersRepository.insert(user);

      // menampilkan data
      return this.usersRepository.findOneOrFail({
        where: { id: result.identifiers[0].id },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.usersRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
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
    try {
      await this.usersRepository.findOneOrFail({
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

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
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

    await this.usersRepository.softDelete(id);
  }
}
