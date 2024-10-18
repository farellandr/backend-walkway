import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BrandModule } from '../brand/brand.module';
import { ProductDetail } from './entities/product-detail.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { BidProduct } from './entities/bid-product.entity';
import { BidParticipant } from './entities/bid-participant.entity';
import { ProductPhoto } from './entities/product-photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductDetail, ProductPhoto, BidProduct, BidParticipant]),
    BrandModule,
    CategoryModule,
    UserModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
