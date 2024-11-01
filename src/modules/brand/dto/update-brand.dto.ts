
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '#/utils/enums/status.enum';

export class UpdateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status
}
