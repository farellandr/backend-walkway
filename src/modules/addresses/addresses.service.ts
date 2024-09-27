import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private userRepository: UsersService,
  ) { }

  async create(createAddressDto: CreateAddressDto) {
    const { user, ...addressData } = createAddressDto
    const getUser = await this.userRepository.findOne(user)

    const result = await this.addressRepository.insert({ ...addressData, user: getUser })
    return this.addressRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        user: true
      }
    });
  }

  findAll() {
    return this.addressRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.addressRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw error;
      }
    }
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const { user, ...addressData } = updateAddressDto
    const getUser = await this.userRepository.findOne(user)

    await this.addressRepository.update(id, { ...addressData, user: getUser })
    return this.addressRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        user: true
      }
    });
  }

  async remove(id: string) {
    try {
      await this.addressRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.addressRepository.softDelete(id);
  }
}
