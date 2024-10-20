import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '#/modules/user/user.service';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '#/modules/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonErrorHandler } from '#/utils/helpers/error-handler';
import { User } from '#/modules/user/entities/user.entity';
import { RoleService } from '#/modules/role/role.service';
import { USER_ROLE } from '#/utils/constants/role.name';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserService,
    private readonly roleRepository: RoleService
  ) { }

  async validate(loginDto: LoginDto) {
    const user = await this.userRepository.findEmail(loginDto.email);
    const validatePass = await bcrypt.compare(loginDto.password, user.password)
    if (!validatePass || !user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'Invalid password or credentials.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user && validatePass) {
      return user;
    }
  }

  async login(user: CreateUserDto) {
    try {
      const payload = { email: user.email, name: user.name };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      throw error
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = new User;
      user.name = registerDto.name;
      user.phone_number = registerDto.phone_number;

      const role = await this.roleRepository.findByName(USER_ROLE)
      user.roleId = role.id;

      const isEmailExist = await this.userRepository.findEmail(registerDto.email);
      if (isEmailExist) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request.',
            message: 'Email already taken',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      user.email = registerDto.email;

      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(registerDto.password, user.salt);

      const result = await this.userRepository.create(user);
      await this.userRepository.createCart(result.id);

      return await this.userRepository.findOne(result.id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
