import { CreateProductDetailDto } from "#/product_details/dto/create-product_detail.dto";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    price: number;

    @IsOptional()
    categoryIds?: string[];

    @IsOptional()
    details?: CreateProductDetailDto[];
}
