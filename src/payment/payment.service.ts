import { Injectable } from '@nestjs/common';
import { CreatePaymentdto } from "./dto/create.payment.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from "./entities/payment.entity";
import { Repository } from 'typeorm';
import { UpPayment } from "./dto/upPayment.dto";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
    ){}

    async createPay(createPaymentdto: CreatePaymentdto){
        const payresult= new Payment()

        payresult.payment_method= createPaymentdto.payment_method
        payresult.payment_total= createPaymentdto.payment_total
        payresult.status= createPaymentdto.status
        payresult.user_id= createPaymentdto.user_id
        payresult.va_number= createPaymentdto.va_number

        const result= await this.paymentRepository.insert(payresult);
        return this.paymentRepository.findOneOrFail({
            where:{id: result.identifiers[0].id,},
        })

    }

    findAll(){
        return this.paymentRepository.findAndCount();
    }

    async findOne(id: string){
        try {
            return await this.paymentRepository.findOneOrFail({
                where:{id},
                relations:{user:true}
            })
        } catch (error) {
            throw error
        }
    }

    async deletepay(id:string){
        try {
            await this.findOne(id)
            await this.paymentRepository.softDelete(id)
            return 'Success Deleted'
        } catch (error) {
            throw error
        }
    }

    async update(id:string, upPayment: UpPayment){
        try {
            await this.paymentRepository.findOneOrFail({
                where:{id},
            })
        } catch (error) {
            throw error
        }
        await this.paymentRepository.update(id, upPayment);
        return this.paymentRepository.findOneOrFail({
            where:{id}
        })
    }
}
