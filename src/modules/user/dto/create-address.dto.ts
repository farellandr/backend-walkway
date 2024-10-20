import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  contact_name: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  contact_number: string;

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
  // @Matches(/^[0-9]{5}$/, { message: 'zip code must be 5 digits' })
  @IsNumber({}, { message: 'Zip code must be a number' })
  @Min(10000, { message: 'Zip code must be at least 5 digits' })
  @Max(99999, { message: 'Zip code must be at most 5 digits' })
  zipcode: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  note: string;
}
