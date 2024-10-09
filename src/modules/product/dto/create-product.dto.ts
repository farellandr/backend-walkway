import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsUUID()
  brandId: string;
}
