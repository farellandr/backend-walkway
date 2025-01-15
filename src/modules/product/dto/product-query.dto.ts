import { IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
