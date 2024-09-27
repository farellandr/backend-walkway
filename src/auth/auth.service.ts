import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '#/modules/users/entities/user.entity';
import { RolesService } from '#/modules/roles/roles.service';
import { USER_ROLE } from '#/common/constants/role.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleRepository: RolesService,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const user = new User
      user.name = registerDto.name
      user.phoneNumber = registerDto.phoneNumber

      const isEmailTaken = await this.userRepository.findOne({
        where: {
          email: registerDto.email,
        }
      });
      if (isEmailTaken) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: `Email ${registerDto.email} already exists. Please try a different one.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      user.email = registerDto.email
      
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(registerDto.password, salt);
      user.salt = salt
      user.password = hashedPass

      const role = await this.roleRepository.findByName(USER_ROLE)
      user.role = role

      const result = await this.userRepository.insert(user);
      return this.userRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: loginDto.email,
        },
        relations: {
          role: true
        }
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

      const role = await this.roleRepository.findByName(user.role.role);

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

      const payload = {
        // id: user.id,
        name: user.name,
        role: role.role,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      throw err;
    }
  }
}
