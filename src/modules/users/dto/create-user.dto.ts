import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    role?: string;
}
