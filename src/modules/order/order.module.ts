import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { JwtModule } from '@nestjs/jwt';
import { CartItem } from '../user/entities/cart-item.entity';
import { Cart } from '../user/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, CartItem, Cart]), HttpModule, UserModule, ProductModule, JwtModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
