import { Product } from "#/product/entities/product.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

export enum SelectStatus {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (Product) => Product.brand)
  Product: Product;

  @Column()
  BrandName: string;

  @Column({
    type: 'enum',
    enum: SelectStatus,
    default: SelectStatus.ACTIVE,
  })
  status: SelectStatus;

  @Column()  
  Brand_image: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  uploadDate: Date;

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
