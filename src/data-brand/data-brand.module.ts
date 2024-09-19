import { Module, forwardRef  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBrandController } from './data-brand.controller';
import { DataBrandService } from './data-brand.service';
import { Brand } from "./entities/brand.entity";
import { ProductModule } from "#/product/product.module";

@Module({
  imports:[TypeOrmModule.forFeature([Brand]),forwardRef(() => ProductModule),],
  controllers: [DataBrandController],
  providers: [DataBrandService]
})
export class DataBrandModule {}
