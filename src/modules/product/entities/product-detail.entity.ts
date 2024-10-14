import { CartItem } from "#/modules/user/entities/cart-item.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { BidProduct } from "./bid-product.entity";
import { Status } from "#/utils/enums/status.enum";

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  size: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

  @ManyToOne(() => Product, (product) => product.productDetails)
  product: Product;
  @Column({ type: 'uuid' })
  productId: string;

  @OneToMany(() => BidProduct, (bidProduct) => bidProduct.productDetail)
  bids: BidProduct[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.productDetail)
  cartItem: CartItem[];

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