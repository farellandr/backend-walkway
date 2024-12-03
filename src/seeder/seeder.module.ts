import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '#/modules/user/entities/user.entity';
import { Role } from '#/modules/role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role])
  ],
  providers: [SeederService],
})
export class SeederModule {}
