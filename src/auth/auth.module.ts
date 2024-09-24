import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { RoleModule } from '#/role/role.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: 'walkway123',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    TypeOrmModule.forFeature([User]),
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
