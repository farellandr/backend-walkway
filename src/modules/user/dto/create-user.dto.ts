import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
