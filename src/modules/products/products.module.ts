import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';
import { ProductDetailsModule } from '../product-details/product-details.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule, BrandsModule, ProductDetailsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
