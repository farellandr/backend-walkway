import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import {
  origin_address,
  origin_contact_name,
  origin_contact_phone,
  origin_postal_code,
} from '#/utils/constants/origin.data';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { OrderItem } from './entities/order-item.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) { }

  private baseUrl = this.configService.get<string>('biteship.url');
  private apiKey = this.configService.get<string>('biteship.secret');
  private biteshipHeader = {
    Authorization: `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  };
  private midtransHeader = {
    Authorization: `Basic U0ItTWlkLXNlcnZlci1sZUJYOVJyWldyV2ptZFFZY1NfZG5NY246`,
    'Content-Type': 'application/json',
  };

  async paymentHandler(body: any) {
    return console.log(body)
  }

  // async create(createOrderDto: CreateOrderDto) {
  //   const address = await this.userService.findAddress(createOrderDto.addressId)
  //   const product = await this.productService.findManyProductDetail(createOrderDto.productDetailId)

  //   const order = await firstValueFrom(
  //     this.httpService.post(`${this.baseUrl}/v1/orders`, {
  //       origin_contact_name: origin_contact_name,
  //       origin_contact_phone: origin_contact_phone,
  //       origin_address: origin_address,
  //       origin_postal_code: origin_postal_code,
  //       destination_contact_name: address.contact_name,
  //       destination_contact_phone: address.contact_number,
  //       destination_address: address.address,
  //       destination_postal_code: address.zipcode,
  //       destination_note: address.note,
  //       courier_company: createOrderDto.courier_company,
  //       courier_type: createOrderDto.courier_type,
  //       delivery_type: createOrderDto.delivery_type,
  //       items: product.map((item) => ({
  //         name: item.product.name,
  //         value: item.product.price,
  //         quantity: 1,
  //         weight: item.product.weight
  //       }))
  //     }, { headers: this.headers }).pipe(
  //       map((res) => res.data),
  //       catchError((error) => {
  //         throw error;
  //       }),
  //     ),
  //   );

  //   const result = await this.orderRepository.insert({
  //     referenceId: order.id,
  //     order_date: order.delivery.datetime,
  //     receipt: order.courier.waybill_id,
  //     status: order.status,
  //     userId: address.user.id
  //   })

  //   for (const detail of product) {
  //     await this.orderItemRepository.insert({ orderId: result.identifiers[0].id, productDetailId: detail.id })
  //   }

  //   return await this.orderRepository.findOneOrFail({
  //     where: {
  //       id: result.identifiers[0].id
  //     },
  //     relations: {
  //       orderItems: true
  //     }
  //   });
  // }

  async getRate(data: any) {
    return await firstValueFrom(
      this.httpService
        .post(
          `${this.baseUrl}/v1/rates/couriers`,
          {
            origin_postal_code: origin_postal_code,
            destination_postal_code: data.address.zipcode,
            couriers: 'anteraja,jne,sicepat,jnt,ninja,paxel,lalamove',
            items: data.product.map((item: any) => ({
              name: item.product.name,
              value: item.product.price,
              quantity: 1,
              weight: 600,
            })),
          },
          { headers: this.biteshipHeader },
        )
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
    );
  }

  async genPaymentToken(data: any) {
    const orderId = randomUUID();

    return await firstValueFrom(
      this.httpService
        .post(
          `https://app.sandbox.midtrans.com/snap/v1/transactions`,
          {
            transaction_details: {
              order_id: orderId,
              gross_amount: data.orderTotal - data.orderShip + data.orderShip,
            },
            item_details: [
              ...data.orderItems.map((item: any) => ({
                id: item.product.id,
                price: item.product.price,
                quantity: 1,
                name: item.product.name,
                brand: item.product.brand.name,
                merchant_name: 'Walkway',
              })),
              {
                id: 'shipping',
                price: data.orderShip,
                quantity: 1,
                name: 'Shipping',
              },
            ],
            customer_details: {
              first_name: data.customer.name,
              email: data.customer.email,
              phone: data.customer.phone_number,
            },
            page_expiry: {
              duration: 10,
              unit: 'minutes',
            },
            custom_field: 'hayuuu',
          },
          { headers: this.midtransHeader },
        )
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
    );
  }

  async genBidPaymentToken(data: any) {

    return await firstValueFrom(
      this.httpService
        .post(
          `https://app.sandbox.midtrans.com/snap/v1/transactions`,
          {
            transaction_details: {
              order_id: data.orderItems.id,
              gross_amount: Number(data.orderTotal),
            },
            item_details: [
              {
                id: data.orderItems.id,
                price: Number(data.orderTotal),
                quantity: 1,
                name: data.orderItems.productDetail.product.id,
                brand: data.orderItems.productDetail.product.brand.id,
                merchant_name: 'Walkway',
              }
            ],
            customer_details: {
              first_name: data.customer.name,
              email: data.customer.email,
              phone: data.customer.phone_number,
            },
            page_expiry: {
              duration: 10,
              unit: 'minutes',
            },
            custom_field: 'hayuuu',
          },
          { headers: this.midtransHeader },
        )
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
    );
  }

  async findAll() {
    const response = await firstValueFrom(
      this.httpService
        .get(`${this.baseUrl}/v2/orders?test_data=true`, {
          headers: this.biteshipHeader,
        })
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
    );
    return response;
  }

  async findOne(id: string) {
    const response = await firstValueFrom(
      this.httpService
        .get(`${this.baseUrl}/v1/orders/${id}`, {
          headers: this.biteshipHeader,
        })
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
    );
    return response;
  }
}
