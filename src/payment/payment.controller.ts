import { Controller,
    Get,
    Post,
    Body,
    Put,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    HttpStatus, } from '@nestjs/common';
import { PaymentService } from "./payment.service";
import {CreatePaymentdto  } from "./dto/create.payment.dto";
import { UpPayment } from "./dto/upPayment.dto";


@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService : PaymentService
    ){}

    @Post()
    async createPay(@Body() createPayDto: CreatePaymentdto){
        return{
            data: await this.paymentService.createPay(createPayDto),
            statusCode: HttpStatus.CREATED,
            massage: 'Data Added'
        }
    }

    @Get()
    async findAll(){
        const [data, count]= await this.paymentService.findAll()

        return{
            data, count,
            statusCode: HttpStatus.OK,
            massage: 'Success'
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string){
        return{
            data: await this.paymentService.findOne(id),
            statusCode: HttpStatus.OK,
            massage: 'Success'
        }
    }

    @Delete(':id')
    async hapus(@Param('id') id:string){
        return{
            data: await this.paymentService.deletepay(id),
            statusCode: HttpStatus.OK,
            massage: 'Succes Deleted'
        }
    }

    @Put(':id')
    async edit(@Param('id', ParseUUIDPipe) id:string,
         @Body()  upPayment: UpPayment){
            return{
                data: await this.paymentService.update(id, upPayment),
                statusCode: HttpStatus.OK,
                massage: 'Edited Success'
            }
         }
}
