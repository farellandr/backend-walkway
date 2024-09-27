import { Status } from "#/common/enums/status.enum";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    img: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status;
}
