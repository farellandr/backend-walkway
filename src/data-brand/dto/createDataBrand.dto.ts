import { IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { SelectStatus } from "../entities/brand.entity";

export class CreateBrandDto {
    @IsNotEmpty()
    BrandName: string;

    @IsEnum(SelectStatus)
    status: SelectStatus;

    @IsNotEmpty()
    foto: string;
}