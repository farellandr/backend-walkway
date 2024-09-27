import { Status } from "#/common/enums/status.enum";
import { CreateProductDetailDto } from "#/modules/product-details/dto/create-product-detail.dto";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsOptional()
    @IsArray()
    categories: string[];

    @IsNotEmpty()
    @IsArray()
    details: CreateProductDetailDto[];

    @IsOptional()
    @IsEnum(Status)
    status: Status;
}
