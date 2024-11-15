import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';

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
    private readonly jwtService: JwtService,
  ) {
    handlebars.registerHelper('multiply', function (a, b) {
      return (a * b).toFixed(2);
    });
    handlebars.registerHelper('formatDate', function (date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });
    handlebars.registerHelper('formatPrice', function (price) {
      return price.toLocaleString('en-US');
    });
    handlebars.registerHelper('toLowerCase', function (status) {
      return status.toLowerCase();
    });
    handlebars.registerHelper('formatPhoneNumber', function (phoneNumber) {
      let formattedNumber = phoneNumber.replace(/^\+62/, '+62 ');

      if (formattedNumber.length > 6) {
        formattedNumber = `${formattedNumber.slice(
          0,
          7,
        )}-${formattedNumber.slice(7, 11)}-${formattedNumber.slice(11, 16)}`;
      }

      return formattedNumber.trim();
    });
    handlebars.registerHelper('formatSubTotal', function (price) {
      return (price - 10000).toLocaleString('en-US');
    });
  }

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
  private midtransLinkHeader = {
    Accept: 'application/json',
    Authorization: `Basic U0ItTWlkLXNlcnZlci1sZUJYOVJyWldyV2ptZFFZY1NfZG5NY246`,
    'Content-Type': 'application/json',
  };

  async generateOrderDetailPDF(orderId: string, res?: Response) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        orderItems: {
          productDetail: {
            product: {
              brand: true,
              productPhotos: true,
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const templatePath = join(__dirname, '/templates/order-detail.hbs');
    const templateContent = readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);

    const html = template({
      order,
      generatedDate: new Date().toLocaleDateString(),
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--allow-file-access-from-files',
      ],
      timeout: 120000,
    });

    try {
      const page = await browser.newPage();

      const fileName = `order-invoice-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 120000,
      });

      await page.evaluate((fileName) => {
        document.title = fileName;
      }, fileName.replace('.pdf', ''));

      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 120000,
      });
      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=${fileName}`,
        'Content-Length': pdf.length,
      });

      res.end(pdf);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
      await browser.close();
    }
  }

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

  async genPaymentLink(data: any) {
    const orderId = randomUUID();
    const address = await this.userService.fetchAddress(
      data.user.defaultAddress,
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
            courier_company: 'jne',
            courier_type: 'reg',
            delivery_type: 'now',
            items: [
              ...data.orderItems.map((item: CartItem) => ({
                name: item.productDetail.product.name,
                value: data.orderTotal,
                quantity: 1,
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
      order_total: data.orderTotal,
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
          `https://api.sandbox.midtrans.com/v1/payment-links`,
          {
            transaction_details: {
              order_id: orderId,
              gross_amount: data.orderTotal,
              // payment_link_id: data.orderItems[0].productDetail.product.id
            },
            customer_required: true,
            usage_limit: 1,
            item_details: [
              ...data.orderItems.map((item: CartItem) => ({
                id: item.productDetail.product.id,
                price: data.orderTotal,
                quantity: 1,
                name: item.productDetail.product.name,
                brand: item.productDetail.product.brand.name,
                merchant_name: 'Walkway',
              })),
            ],
            customer_details: {
              first_name: data.user.name,
              email: data.user.email,
              phone: data.user.phone_number,
            },
            expiry: {
              duration: 3,
              unit: 'hours',
            },
            // custom_field1: 'order',
          },
          { headers: this.midtransLinkHeader },
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
      order_total: data.orderTotal + data.delivery.price,
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
          user: true,
        },
      },
      order: {
        createdAt: 'desc',
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
