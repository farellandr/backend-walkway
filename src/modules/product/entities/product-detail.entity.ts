import { CartItem } from "#/modules/user/entities/cart-item.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  size: number;

  @Column({ type: 'int' })
  stock: number;

  @ManyToOne(() => Product, (product) => product.productDetails)
  product: Product;
  @Column({ type: 'uuid' })
  productId: string;

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