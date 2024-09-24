import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePaymentdto {
    @IsNotEmpty()
    payment_method: string;

    @IsNotEmpty()
    payment_total: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    va_number: number;

    @IsNotEmpty()
    user_id: string;

}