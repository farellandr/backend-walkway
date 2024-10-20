import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { cleanErrorMessage } from '#/utils/helpers/clean-error-message';
import * as bcrypt from 'bcrypt'
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RoleService } from '../role/role.service';
import { Cart } from './entities/cart.entity';
import { CreateCartItemDto } from '../product/dto/create-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CommonErrorHandler } from '#/utils/helpers/error-handler';
import { ProductDetail } from '../product/entities/product-detail.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,

    private readonly roleRepository: RoleService
  ) { }

  async findAddress(id: string) {
    try {
      return await this.addressRepository.findOneOrFail({
        where: { id },
        relations: {
          user: true
        }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createAddress(createAddressDto: CreateAddressDto) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: createAddressDto.userId } })

      const result = await this.addressRepository.insert(createAddressDto);
      return await this.addressRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async updateAddress(updateAddressDto: UpdateAddressDto) {
    try {
      const { addressId, ...addressData } = updateAddressDto;
      await this.userRepository.findOneOrFail({ where: { id: addressData.userId } })
      await this.addressRepository.findOneOrFail({ where: { id: addressId } })

      await this.addressRepository.update(addressId, addressData)
      return await this.addressRepository.findOneOrFail({
        where: {
          id: addressId
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async removeAddress(id: string) {
    try {
      await this.addressRepository.findOneOrFail({
        where: { id },
      });

      await this.addressRepository.softDelete(id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async createCartItem(createCartItemDto: CreateCartItemDto) {
    try {
      await Promise.all([
        this.cartRepository.findOneOrFail({ where: { id: createCartItemDto.cartId } }),
        this.productDetailRepository.findOneOrFail({ where: { id: createCartItemDto.productDetailId } })
      ])

      const result = await this.cartItemRepository.insert(createCartItemDto)
      return await this.cartItemRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
        relations: {
          productDetail: {
            product: true,
          },
          cart: {
            user: true
          },
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findCart(id: string) {
    try {
      return await this.cartRepository.findOneOrFail({
        where: { id }
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found.',
            message: cleanErrorMessage(error.message),
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error.',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createCart(userId: string) {
    try {
      const result = await this.cartRepository.insert({ userId: userId });

      return await this.cartRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User;
      user.name = createUserDto.name;
      user.phone_number = createUserDto.phone_number;

      await this.roleRepository.findOne(createUserDto.roleId)
      user.roleId = createUserDto.roleId;

      const isEmailExist = await this.userRepository.findOne({
        where: {
          email: createUserDto.email
        }
      });
      if (isEmailExist) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request.',
            message: 'Email already taken',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      user.email = createUserDto.email;

      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(createUserDto.password, user.salt);

      const result = await this.userRepository.insert(user);
      // await this.cartRepository.insert({ userId: result.identifiers[0].id });

      return await this.userRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id
        },
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  // should only get admins
  async findAll(page: number = 1, limit: number = 10) {
    try {
      return await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: {
          role: true,
        }
      })
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
        relations: {
          addresses: true
        }
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.findOneOrFail({
        where: { id },
      });

      await this.userRepository.update(id, updateUserDto);
      return await this.userRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
      });

      const isPasswordNew = await bcrypt.compare(updatePasswordDto.password, user.password)
      if (isPasswordNew) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request.',
            message: 'New password must be different.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      updatePasswordDto.password = await bcrypt.hash(updatePasswordDto.password, user.salt)

      await this.userRepository.update(id, updatePasswordDto);
      return await this.userRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      CommonErrorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.findOneOrFail({
        where: { id },
      });

      await this.userRepository.softDelete(id);
    } catch (error) {
      CommonErrorHandler(error);
    }
  }
}
