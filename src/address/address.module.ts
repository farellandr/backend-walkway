import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { User } from '#/users/entities/user.entity';
import { UsersModule } from '#/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Address, User])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
