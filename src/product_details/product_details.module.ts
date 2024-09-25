import { Module } from '@nestjs/common';
import { ProductDetailsService } from './product_details.service';
import { ProductDetailsController } from './product_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetail } from './entities/product_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDetail])],
  controllers: [ProductDetailsController],
  providers: [ProductDetailsService],
  exports: [ProductDetailsService]
})
export class ProductDetailsModule {}
