import { IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  roleName: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
