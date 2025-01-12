import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSizeDto {
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
