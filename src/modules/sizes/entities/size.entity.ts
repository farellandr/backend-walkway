import { Product } from '#/modules/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'int' })
  stock: number;

  @ManyToOne(() => Product, (product) => product.sizes)
  product: Product;

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
