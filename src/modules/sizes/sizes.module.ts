import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Size])],
})
export class SizesModule {}
