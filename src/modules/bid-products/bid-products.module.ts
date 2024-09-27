import { Module } from '@nestjs/common';
import { BidProductsService } from './bid-products.service';
import { BidProductsController } from './bid-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidProduct } from './entities/bid-product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([BidProduct]), ProductsModule],
  controllers: [BidProductsController],
  providers: [BidProductsService]
})
export class BidProductsModule {}
