import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UsersService } from '#/users/users.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private usersService: UsersService,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      await this.usersService.findOne(createAddressDto.userId);

      const newAddress = await this.addressRepository.insert(createAddressDto);

      return this.addressRepository.findOneOrFail({
        where: {
          id: newAddress.identifiers[0].id,
        },
      });
    } catch (error) {
      throw error;
    }
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
    try {
      await this.findOne(id);

      await this.addressRepository.update(id, updateAddressDto);

      return this.addressRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      const removeAddress = await this.addressRepository.delete(id);

      if (removeAddress.affected === 1) {
        return { message: 'Address successfully deleted' };
      }
    } catch (error) {
      throw error;
    }
  }
}
