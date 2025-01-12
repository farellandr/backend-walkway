import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ProductSort {
  LOWEST_PRICE = 'lowest_price',
  HIGHEST_PRICE = 'highest_price',
  AZ = 'az',
  ZA = 'za',
}

export class ProductQueryDto {
  @IsOptional()
  @IsEnum(ProductSort)
  sort: ProductSort;

  @IsOptional()
  @IsString()
  search: string;
}
