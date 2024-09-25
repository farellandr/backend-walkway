import { User } from '#/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register-auth.dto';
import { RoleService } from '#/role/role.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // cek role apakah ada atau tidak
      const roleName = await this.roleService.findByName(registerDto.roleName);

      if (!roleName) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'role not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // cek email apakah sudah digunakan atau tidak
      const cekEmail = await this.usersRepository.findOne({
        where: {
          email: registerDto.email,
        },
      });

      if (cekEmail) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: `Email ${registerDto.email} already exists. Please try a different one.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // generate salt
      const salt = await bcrypt.genSalt();

      // hash password
      const hashedPass = await bcrypt.hash(registerDto.password, salt);

      // memasukan registerDto, password, salt kedalam variable user
      const user = {
        ...registerDto,
        password: hashedPass,
        salt,
      };

      // memasukan value user kedalam database
      const registerResult = await this.usersRepository.insert(user);

      //mengembalikan nilai yang sudah dimasukan
      return this.usersRepository.findOneOrFail({
        where: {
          id: registerResult.identifiers[0].id,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: loginDto.email,
        },
      });

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'email not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const role = await this.roleService.findByName(user.roleName);

      const comparePassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!comparePassword) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'password is invalid',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const playload = {
        id: user.id,
        name: user.name,
        role,
      };

      return {
        accessToken: await this.jwtService.sign(playload),
      };
    } catch (err) {
      throw err;
    }
  }
}
