import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @IsNotEmpty()
  @IsUUID()
  productDetailId: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
