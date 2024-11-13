import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { createHash, randomUUID } from 'crypto';
import { CartItem } from '../user/entities/cart-item.entity';
import { OrderStatus } from '#/utils/enums/order-status.enum';
import { JwtService } from '@nestjs/jwt';
import { Cart } from '../user/entities/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly jwtService: JwtService,
  ) {}

  private baseUrl = this.configService.get<string>('biteship.url');
  private apiKey = this.configService.get<string>('biteship.secret');
  private midtransServer = this.configService.get<string>('midtrans.server');
  private biteshipHeader = {
    Authorization: `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  };
  private midtransHeader = {
    Authorization: `Basic U0ItTWlkLXNlcnZlci1sZUJYOVJyWldyV2ptZFFZY1NfZG5NY246`,
    'Content-Type': 'application/json',
  };

  // {
  //   transaction_type: 'on-us',
  //   transaction_time: '2024-11-07 11:58:37',
  //   transaction_status: 'settlement',
  //   transaction_id: '30e77f39-ffda-449f-a307-366061777d71',
  //   status_message: 'midtrans payment notification',
  //   status_code: '200',
  //   signature_key: 'e9ec7f1054e75231162da332d77a64692307a0973aed07d73e1fc18c8e4f52d68e3fd1f7e8a1ae76e6fff2f2f51879aac250b5d39322d105b5f99fb8c25d1763',
  //   settlement_time: '2024-11-07 11:58:48',
  //   payment_type: 'qris',
  //   order_id: '8f9fed02-f3c3-4e5d-90a9-8b01cc2aba31',
  //   merchant_id: 'G451523749',
  //   issuer: 'gopay',
  //   gross_amount: '1930000.00',
  //   fraud_status: 'accept',
  //   expiry_time: '2024-11-07 12:13:37',
  //   custom_field1: 'order',
  //   currency: 'IDR',
  //   acquirer: 'gopay'
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
              name: item.productDetail.product.name,
              value: item.productDetail.product.price,
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

  async paymentHandler(data: any) {
    const order = await this.orderRepository.findOneOrFail({
      where: { id: data.order_id },
    });

    console.log(order);

    // const hash = createHash('sha512')
    //   .update(
    //     `${order.id}${data.status_code}${data.gross_amount}${this.midtransServer}`,
    //   )
    //   .digest('hex');

    // if (data.signature_key !== hash) {
    //   throw new HttpException(
    //     {
    //       statusCode: HttpStatus.UNAUTHORIZED,
    //       error: 'Unauthorized',
    //       message: 'Invalid signature key.',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // Get all order items for this order
    const orderItems = await this.orderItemRepository.find({
      where: { orderId: order.id },
    });

    // Get cart associated with the order's user
    const cart = await this.cartRepository.findOneOrFail({
      where: { userId: order.address.userId },
    });

    // Get all cart items for this cart
    const cartItems = await this.cartItemRepository.find({
      where: { cartId: cart.id },
    });

    // Create a Set of productDetailIds from order items
    const orderedProductDetailIds = new Set(
      orderItems.map((item) => item.productDetailId),
    );

    // Remove cart items that have matching productDetailIds with the order
    for (const cartItem of cartItems) {
      if (orderedProductDetailIds.has(cartItem.productDetailId)) {
        await this.cartItemRepository.softDelete(cartItem.id);
      }
    }

    console.log(orderItems, cart, cartItems);

    return {
      message: 'Payment processed and cart items removed successfully',
      orderId: order.id,
    };
  }

  async genPaymentToken(data: any) {
    const orderId = randomUUID();

    const address = await this.userService.fetchAddress(
      data.customer.defaultAddress,
    );

    const order = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseUrl}/v1/orders`,
          {
            origin_contact_name: origin_contact_name,
            origin_contact_phone: origin_contact_phone,
            origin_address: origin_address,
            origin_postal_code: origin_postal_code,
            destination_contact_name: address.contact_name,
            destination_contact_phone: address.contact_number,
            destination_address: address.address,
            destination_postal_code: address.zipcode,
            delivery: data.delivery,
            courier_company: data.delivery.company,
            courier_type: data.delivery.type,
            delivery_type: 'now',
            items: [
              ...data.orderItems.map((item: CartItem) => ({
                name: item.productDetail.product.name,
                value: item.productDetail.product.price,
                quantity: item.quantity,
                weight: item.productDetail.product.weight,
              })),
            ],
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

    const result = await this.orderRepository.insert({
      id: orderId,
      referenceId: order.id,
      order_date: order.delivery.datetime,
      receipt: order.courier.waybill_id,
      status: order.status,
      addressId: address.id,
      order_total: data.orderTotal + data.delivery.price
    });

    for (const detail of data.orderItems) {
      await this.orderItemRepository.insert({
        orderId: result.identifiers[0].id,
        productDetailId: detail.productDetail.id,
      });
    }

    return await firstValueFrom(
      this.httpService
        .post(
          `https://app.sandbox.midtrans.com/snap/v1/transactions`,
          {
            transaction_details: {
              order_id: orderId,
              gross_amount: data.orderTotal + data.delivery.price,
            },
            item_details: [
              ...data.orderItems.map((item: CartItem) => ({
                id: item.productDetail.product.id,
                price: item.productDetail.product.price,
                quantity: item.quantity,
                name: item.productDetail.product.name,
                brand: item.productDetail.product.brand.name,
                merchant_name: 'Walkway',
              })),
              {
                id: 100,
                price: data.delivery.price,
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
              unit: 'minute',
            },
            // custom_field1: 'order',
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

  async findAll() {
    return this.orderRepository.find({
      relations: {
        orderItems: {
          productDetail: {
            product: {
              brand: true,
              productPhotos: true,
            },
          },
        },
        address: {
          user: true
        }
      },
    });
    // const response = await firstValueFrom(
    //   this.httpService
    //     .get(`${this.baseUrl}/v2/orders?test_data=true`, {
    //       headers: this.biteshipHeader,
    //     })
    //     .pipe(
    //       map((res) => res.data),
    //       catchError((error) => {
    //         throw error;
    //       }),
    //     ),
    // );
    // return response;
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
