import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  salt: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
