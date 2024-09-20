import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    price: number;

    @IsOptional()
    categoryIds?: string[];
}
