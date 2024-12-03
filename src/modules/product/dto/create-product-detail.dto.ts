import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDetailDto {
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
