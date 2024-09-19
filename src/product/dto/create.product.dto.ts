import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    nameProduct: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    brand_id: string;
}