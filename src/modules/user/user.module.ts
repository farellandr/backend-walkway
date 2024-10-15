import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleModule } from '../role/role.module';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Address } from './entities/address.entity';
import { ProductDetail } from '../product/entities/product-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart, CartItem, Address, ProductDetail]),
    RoleModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
