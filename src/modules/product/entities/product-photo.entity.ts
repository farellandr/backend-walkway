import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { PhotoType } from '#/utils/enums/photo-types.enum';

@Entity()
export class ProductPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({
    type: 'enum',
    enum: PhotoType,
  })
  photoType: PhotoType;

  @ManyToOne(() => Product, (product) => product.productPhotos)
  product: Product;
  @Column('uuid')
  productId: string;

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
