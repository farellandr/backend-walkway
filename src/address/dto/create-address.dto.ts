import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  contactName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  contactNumber: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{5}$/, { message: 'zip code must be 5 digits' })
  zipCode: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  note: string;
}
