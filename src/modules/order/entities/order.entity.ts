import { OrderStatus } from "#/utils/enums/order-status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "#/modules/user/entities/user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 24 })
  referenceId: string

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  order_date: Date;
  
  @Column({ type: 'varchar', length: 255 })
  receipt: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.ON_HOLD
  })
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
  @Column('uuid')
  userId: string;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.order)
  orderItems: OrderItem[];

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
