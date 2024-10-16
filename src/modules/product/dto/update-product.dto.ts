import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Status } from '#/utils/enums/status.enum';
import { Type } from 'class-transformer';
import { UpdateProductDetailDto } from './update-product-detail.dto';

export class UpdateProductDto {
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
  @Type(() => UpdateProductDetailDto)
  productDetails: UpdateProductDetailDto[];

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
