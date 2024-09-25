import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from '#/users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      // mengambil userId
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: createCartDto.userId,
        },
      });

      // membuat instance baru
      const newCart = new Cart();

      newCart.user = user;

      // memasukan userId kedalam cartRepository
      const result = await this.cartRepository.insert(newCart);

      return this.cartRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id,
        },
        // agar password dan salt tidak tampil
        relations: ['user'],
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            roleName: true,
          },
        },
      });
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.cartRepository.findAndCount({
      relations: ['user'],
      // agar saat menggunakan findAll password dan salt tidak tampil
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          roleName: true,
        },
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.cartRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ['user'],
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            roleName: true,
          },
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Entity not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    try {
      // mengambil userId dari user repository
      const userId = await this.userRepository.findOneOrFail({
        where: {
          id: updateCartDto.userId,
        },
      });

      // validasi apa cartId ada atau tidak
      await this.findOne(id);

      // melakukan update
      await this.cartRepository.update(id, userId);

      // mengeluarkan hasil update
      return this.cartRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ['user'],
      });
    } catch (err) {
      throw err;
    }
  }

  async remove(id: string) {
    try {
      // validasi apakah cartId ada atau tidak
      const cart = await this.findOne(id);

      // menghapus data berdasarkan id
      await this.cartRepository.softRemove(cart);
    } catch (err) {
      throw err;
    }
  }
}
