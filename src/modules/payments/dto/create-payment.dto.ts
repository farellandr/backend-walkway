import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    paymentMethod: string;

    @IsNotEmpty()
    @IsNumber()
    paymentTotal: number;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    vaNumber: string;

    @IsNotEmpty()
    @IsString()
    user: string;
}
