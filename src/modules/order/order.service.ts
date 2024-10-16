import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CommonErrorHandler } from '#/utils/helpers/error-handler';
import { origin_address, origin_contact_name, origin_contact_phone, origin_postal_code } from '#/utils/constants/origin.data';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { OrderItem } from './entities/order-item.entity';

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
    private readonly productService: ProductService
  ) { }

  private baseUrl = this.configService.get<string>('biteship.url')
  private apiKey = this.configService.get<string>('biteship.secret')
  private headers = {
    Authorization: `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  };

  async create(createOrderDto: CreateOrderDto) {
    try {
      const address = await this.userService.findAddress(createOrderDto.addressId)
      const product = await this.productService.findManyProductDetail(createOrderDto.productDetailId)

      const order = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/v1/orders`, {
          origin_contact_name: origin_contact_name,
          origin_contact_phone: origin_contact_phone,
          origin_address: origin_address,
          origin_postal_code: origin_postal_code,
          destination_contact_name: address.contact_name,
          destination_contact_phone: address.contact_number,
          destination_address: address.address,
          destination_postal_code: address.zipcode,
          destination_note: address.note,
          courier_company: createOrderDto.courier_company,
          courier_type: createOrderDto.courier_type,
          delivery_type: createOrderDto.delivery_type,
          items: product.map((item) => ({
            name: item.product.name,
            value: item.product.price,
            quantity: 1,
            weight: item.product.weight
          }))
        }, { headers: this.headers }).pipe(
            map((res) => res.data),
            catchError((error) => {
              throw error;
            }),
          ),
      );

      const result = await this.orderRepository.insert({
        referenceId: order.id,
        order_date: order.delivery.datetime,
        receipt: order.courier.waybill_id,
        status: order.status,
        userId: address.user.id
      })

      for (const detail of product) {
        await this.orderItemRepository.insert({orderId: result.identifiers[0].id, productDetailId: detail.id})
      }

      return await this.orderRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
        relations: {
          orderItems: true
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v2/orders?test_data=true`, { headers: this.headers }).pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
      );
      return response;
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/v1/orders/${id}`, { headers: this.headers }).pipe(
          map((res) => res.data),
          catchError((error) => {
            throw error;
          }),
        ),
      );
      return response;
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
