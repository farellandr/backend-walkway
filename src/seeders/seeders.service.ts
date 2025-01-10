import { Role } from '#/modules/role/entities/role.entity';
import { User } from '#/modules/user/entities/user.entity';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { defaultRoleData } from './data/role';
import { defaultUserData } from './data/user';

@Injectable()
export class SeedersService implements OnApplicationBootstrap {
  private logger = new Logger(SeedersService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  private async seed() {
    for (const role of defaultRoleData) {
      const isRoleExist = await this.roleRepository.findOne({
        where: { name: role.name },
      });

      if (!isRoleExist) {
        await this.roleRepository.save(role);
      }
    }
    for (const user of defaultUserData) {
      const isUserExist = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (!isUserExist) {
        await this.userRepository.save({
          ...user,
          password: await bcrypt.hash(
            this.configService.get('user.password'),
            await bcrypt.genSalt(),
          ),
          role: await this.roleRepository.findOne({
            where: { name: defaultRoleData[2].name },
          }),
        });
      }
    }
  }

  async onApplicationBootstrap() {
    if (this.configService.get('env') === 'development') {
      await this.seed();
      this.logger.log('Seeder run successfully');
    }
  }
}
