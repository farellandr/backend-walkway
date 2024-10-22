import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateProductDetailDto } from './create-product-detail.dto';
import { Type } from 'class-transformer';

class ProductPhotosDto {
  @IsNotEmpty()
  @IsString()
  front: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  side: string[];

  @IsNotEmpty()
  @IsString()
  bottom: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryId: string[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDetailDto)
  productDetails: CreateProductDetailDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProductPhotosDto)
  productPhotos: ProductPhotosDto;

  // @IsNotEmpty()
  // @IsArray()
  // @IsString({ each: true })
  // productPhotos: string[];
}
