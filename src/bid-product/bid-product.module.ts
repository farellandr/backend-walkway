import { Module } from '@nestjs/common';
import { BidProductService } from './bid-product.service';
import { BidProductController } from './bid-product.controller';
import { BidProduct } from "./entities/bid-product.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from "#/product/product.module";

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([BidProduct])],
  controllers: [BidProductController],
  providers: [BidProductService]
})
export class BidProductModule {}
