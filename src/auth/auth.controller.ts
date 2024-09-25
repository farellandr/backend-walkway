import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() registerDto: RegisterDto) {
    return {
      data: await this.authService.register(registerDto),
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return {
      data: await this.authService.login(loginDto),
      statusCode: HttpStatus.OK,
      massage: 'Success',
    };
  }
}
