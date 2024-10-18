import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateProductDetailDto } from "./create-product-detail.dto";
import { Type } from "class-transformer";

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
  @IsArray()
  @IsString({ each: true })
  productPhotos: string[];
}
