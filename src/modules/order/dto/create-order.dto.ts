import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
