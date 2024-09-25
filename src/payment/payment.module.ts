import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from "./entities/payment.entity";
import { UsersModule } from "#/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), UsersModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
