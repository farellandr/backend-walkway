import { OrderStatus } from "#/utils/enums/order-status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
