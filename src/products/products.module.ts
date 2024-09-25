import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '#/categories/categories.module';
import { ProductDetailsModule } from '#/product_details/product_details.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule, ProductDetailsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
