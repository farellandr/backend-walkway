import { Role } from '#/modules/role/entities/role.entity';
import { User } from '#/modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [SeedersService],
})
export class SeedersModule {}
