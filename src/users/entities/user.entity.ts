import { Address } from '#/address/entities/address.entity';
import { Cart } from '#/cart/entities/cart.entity';
import { Role } from '#/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  // VersionColumn,n
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  salt: string;

  @Column({ type: 'text' })
  password: string;

  // @Column({ default: true })
  // isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;

  // @VersionColumn()
  // version: number;

  @Column({
    default: 'user',
  })
  roleName: string;

  // Realasi dengan table role
  @ManyToOne(
    () => {
      return Role;
    },
    (role) => {
      return role.users;
    },
  )
  role: Role;

  // Realasi dengan table address
  @OneToMany(
    () => {
      return Address;
    },
    (address) => {
      return address.user;
    },
  )
  address: Address[];

  // Realsi dengan table cart (menyimpan FK-User)
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
