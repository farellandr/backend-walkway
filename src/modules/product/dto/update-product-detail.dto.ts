import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Status } from '#/utils/enums/status.enum';

export class UpdateProductDetailDto {
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
