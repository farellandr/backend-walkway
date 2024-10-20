import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validate(loginDto);
    return {
      data: await this.authService.login(user),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      data: await this.authService.login(user),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
