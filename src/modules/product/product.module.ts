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
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductDetail, ProductPhoto, BidProduct, BidParticipant]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '24h' }
      })
    }),
    BrandModule,
    CategoryModule,
    UserModule,
    JwtModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
            colorize: true,
          },
        },
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
