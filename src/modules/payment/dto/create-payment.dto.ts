import { PaymentStatus } from "#/utils/enums/payment-status.enum";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @IsNotEmpty()
  @IsNumber()
  payment_total: number;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNotEmpty()
  @IsString()
  va_number: string;
}
