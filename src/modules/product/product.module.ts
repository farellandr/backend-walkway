import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { Image } from '../image/entities/image.entity';
import { Size } from '../sizes/entities/size.entity';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand, Category, Image, Size])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
