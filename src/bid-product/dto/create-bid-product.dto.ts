import { IsNotEmpty, IsOptional,  IsDateString} from "class-validator";

export class CreateBidProductDto {
    @IsNotEmpty()
    product_id: string;

    @IsNotEmpty()
    @IsDateString()
    StartDate: Date;

    @IsNotEmpty()
    @IsDateString()
    EndDate: Date;

    @IsNotEmpty()
    StartPrice: number;
}
