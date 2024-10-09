import { Status } from '#/utils/enums/status.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phone_number?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status
}
