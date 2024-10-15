import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Cart } from "./cart.entity";
import { ProductDetail } from "#/modules/product/entities/product-detail.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (cart) => cart.orderItems)
  order: Order;
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => ProductDetail, (productDetail) => productDetail.cartItem)
  productDetail: ProductDetail;
  @Column({ type: 'uuid' })
  productDetailId: string;

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
