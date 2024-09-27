import { Status } from "#/common/enums/status.enum";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status;
}
