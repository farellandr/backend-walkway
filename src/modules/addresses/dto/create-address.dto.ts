import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    contactName: string;

    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @IsNotEmpty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @Matches(/^[0-9]{5}$/, { message: 'zip code must be 5 digits' })
    zipCode: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    note: string;

    @IsNotEmpty()
    @IsString()
    user: string;
}
