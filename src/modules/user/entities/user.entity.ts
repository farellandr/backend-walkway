import { Payment } from "#/modules/payment/entities/payment.entity";
import { Role } from "#/modules/role/entities/role.entity";
import { Status } from "#/utils/enums/status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "#/modules/order/entities/order.entity";
import { Address } from "./address.entity";
import { BidParticipant } from "#/modules/product/entities/bid-participant.entity";

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

  @OneToMany(() => BidParticipant, (bidParticipant) => bidParticipant.user)
  bidParticipants: BidParticipant[];

  @OneToOne(() => Cart, (cart) => cart.user, { nullable: true })
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, { nullable: true })
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
