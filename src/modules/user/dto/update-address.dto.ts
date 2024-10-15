
import { IsNotEmpty, IsPhoneNumber, IsString, IsUUID, Matches } from 'class-validator';

export class UpdateAddressDto {
  @IsNotEmpty()
  @IsUUID()
  addressId: string;

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
  @Matches(/^[0-9]{5}$/, { message: 'zip code must be 5 digits' })
  zipcode: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  note: string;
}
