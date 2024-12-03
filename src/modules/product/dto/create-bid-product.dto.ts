import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateBidProductDto {
  @IsNotEmpty()
  @IsUUID()
  productDetailId: string;
  
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsNotEmpty()
  @IsNumber()
  start_price: number;
}
