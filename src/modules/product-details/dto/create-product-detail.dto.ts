import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDetailDto {
    @IsNotEmpty()
    @IsNumber()
    size: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;
}
