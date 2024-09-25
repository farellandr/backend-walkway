import { IsNotEmpty } from "class-validator";

export class CreateProductDetailDto {
    @IsNotEmpty()
    size: number;

    @IsNotEmpty()
    stock: number;
}
