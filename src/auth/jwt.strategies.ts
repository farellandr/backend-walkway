import { User } from '#/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class Jwtstrategies extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      secretKey: 'walkway123',
      jwtFormRequest: ExtractJwt.formAuthHeaderAsBearerToken(),
    });
  }

  async validate(playload) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: playload.id,
        },
      });

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      throw err;
    }
  }
}
