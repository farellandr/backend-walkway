import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '#/modules/user/user.service';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '#/modules/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserService,
    private readonly jwtService: JwtService,
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
}
