import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from '#/modules/users/entities/user.entity';
import { RolesModule } from '#/modules/roles/roles.module';

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
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
