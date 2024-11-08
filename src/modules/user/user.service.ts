import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RoleService } from '../role/role.service';
import { Cart } from './entities/cart.entity';
import { CreateCartItemDto } from '../product/dto/create-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';
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

    private readonly roleRepository: RoleService,
  ) {}

  async updateCartItem(cartItemId: string, quantity: number) {
    await this.cartItemRepository.findOneOrFail({
      where: { id: cartItemId },
    });

    await this.cartItemRepository.update(cartItemId, { quantity });
    return await this.cartItemRepository.findOneOrFail({
      where: { id: cartItemId },
    });
  }

  async getAddress(id: string) {
    return await this.addressRepository.findOneOrFail({
      where: { id },
    });
  }

  async getCartItems(cartId: string) {
    return await this.cartItemRepository.find({
      where: { cartId },
      relations: {
        cart: true,
        productDetail: {
          product: {
            brand: true,
            productPhotos: true,
          },
        },
      },
    });
  }

  async findAddress(email: string) {
    return await this.addressRepository.find({
      where: { user: { email } },
      relations: {
        user: true,
      },
    });
  }

  async fetchAddress(id: string) {
    return await this.addressRepository.findOneOrFail({
      where: { user: { defaultAddress: id } },
      relations: {
        user: true,
      },
    });
  }

  async createAddress(createAddressDto: CreateAddressDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { email: createAddressDto.email },
      relations: {
        addresses: true,
      },
    });

    const result = await this.addressRepository.insert({
      ...createAddressDto,
      userId: user.id,
    });

    if (user.addresses.length === 0) {
      await this.userRepository.update(user.id, {
        defaultAddress: result.identifiers[0].id,
      });
    }

    return await this.addressRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  async setAddress(body: any) {
    const user = await this.userRepository.findOneOrFail({
      where: { email: body.email },
      relations: {
        addresses: true,
      },
    });

    await this.userRepository.update(user.id, {
      defaultAddress: body.addressId,
    });

    return user;
  }

  async updateAddress(updateAddressDto: UpdateAddressDto) {
    const { addressId, ...addressData } = updateAddressDto;
    await this.userRepository.findOneOrFail({
      where: { id: addressData.userId },
    });
    await this.addressRepository.findOneOrFail({ where: { id: addressId } });

    await this.addressRepository.update(addressId, addressData);
    return await this.addressRepository.findOneOrFail({
      where: {
        id: addressId,
      },
    });
  }

  async removeAddress(id: string) {
    await this.addressRepository.findOneOrFail({
      where: { id },
    });

    await this.addressRepository.softDelete(id);
  }

  async findEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: {
        role: true,
        cart: true,
      },
    });
  }

  async createCartItem(createCartItemDto: CreateCartItemDto) {
    await Promise.all([
      this.cartRepository.findOneOrFail({
        where: { id: createCartItemDto.cartId },
      }),
      this.productDetailRepository.findOneOrFail({
        where: { id: createCartItemDto.productDetailId },
      }),
    ]);

    const result = await this.cartItemRepository.insert(createCartItemDto);
    return await this.cartItemRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: {
        productDetail: {
          product: true,
        },
        cart: {
          user: true,
        },
      },
    });
  }

  async findCart(id: string) {
    return await this.cartRepository.findOneOrFail({
      where: { id },
      relations: {
        cartItems: {
          productDetail: true
        }
      }
    });
  }

  async createCart(userId: string) {
    const result = await this.cartRepository.insert({ userId: userId });

    return await this.cartRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  async register(user: CreateUserDto) {
    const result = await this.userRepository.insert(user);
    await this.cartRepository.insert({ userId: result.identifiers[0].id });

    return await this.userRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;
    user.phone_number = createUserDto.phone_number;

    await this.roleRepository.findOne(createUserDto.roleId);
    user.roleId = createUserDto.roleId;

    const isEmailExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
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

    return await this.userRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    return await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        role: true,
      },
    });
  }

  async findAdmins(page: number = 1, limit: number = 10) {
    return await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        role: true,
      },
      where: {
        role: {
          name: Not(In(['user', 'superadmin'])),
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByToken(data: any) {
    const user = await this.userRepository.findOneOrFail({
      where: { email: data.email },
      relations: {
        addresses: true,
        role: true,
        cart: {
          cartItems: true
        }
      },
    });

    return {
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role.name,
      defaultAddress: user.defaultAddress,
      cartId: user?.cart?.id || '',
      cartItemTotal: user.cart.cartItems.length
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOneOrFail({
      where: { id },
      relations: {
        addresses: true,
        role: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.findOneOrFail({
      where: { id },
    });

    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneOrFail({
      where: { id },
    });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });

    const isPasswordNew = await bcrypt.compare(
      updatePasswordDto.password,
      user.password,
    );
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
    updatePasswordDto.password = await bcrypt.hash(
      updatePasswordDto.password,
      user.salt,
    );

    await this.userRepository.update(id, updatePasswordDto);
    return await this.userRepository.findOneOrFail({
      where: { id },
    });
  }

  async remove(id: string) {
    await this.userRepository.findOneOrFail({
      where: { id },
    });

    await this.userRepository.softDelete(id);
  }
}
