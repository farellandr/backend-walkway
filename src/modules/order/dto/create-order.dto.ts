import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  addressId: string;
  
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  productDetailId: string[];

  @IsNotEmpty()
  @IsString()
  courier_company: string;
  
  @IsNotEmpty()
  @IsString()
  courier_type: string;
  
  @IsNotEmpty()
  @IsString()
  delivery_type: string;
}
