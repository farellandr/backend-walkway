import { IsNotEmpty } from "class-validator";

export class CreateBidParticipantDto {
    @IsNotEmpty()
    bidProduct_id: string;

    @IsNotEmpty()
    payment_id: string;

    @IsNotEmpty()
    amount: number;
}
