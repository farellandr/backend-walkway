import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBrandController } from './data-brand.controller';
import { DataBrandService } from './data-brand.service';
import { Brand } from "./entities/brand.entity";

@Module({
  imports:[TypeOrmModule.forFeature([Brand])],
  controllers: [DataBrandController],
  providers: [DataBrandService]
})
export class DataBrandModule {}
