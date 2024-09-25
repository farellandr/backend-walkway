import { Brand } from "#/data-brand/entities/brand.entity";
import { BidProduct } from "#/bid-product/entities/bid-product.entity";
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Brand, (brand) => brand.Product)
  brand: Brand;
  @Column()
  brand_id: string;

  @OneToMany(() => BidProduct, (bid) => bid.product)
  bid: BidProduct;

  @Column()
  nameProduct: string;

  @Column('int')
  price: number;

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
