import { Payment } from "#/modules/payment/entities/payment.entity";
import { Role } from "#/modules/role/entities/role.entity";
import { Status } from "#/utils/enums/status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "#/modules/order/entities/order.entity";
import { Address } from "./address.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 60 })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  salt: string;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
  @Column({ type: 'uuid' })
  roleId: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

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
}
