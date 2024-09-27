import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBidProductDto {
    @IsNotEmpty()
    @IsString()
    product: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;

    @IsNotEmpty()
    @IsNumber()
    startPrice: number;
}
