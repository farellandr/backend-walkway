import { Product } from '#/product/entities/product.entity';
import { BidParticipant } from "#/bid-participant/entities/bid-participant.entity";
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
export class BidProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.bid)
  product: Product[];
  @Column()
  product_id: string;
  
  @OneToMany(() => BidParticipant, (bidUser) => bidUser.bidProduct)
  bidUser: BidParticipant[];

  @Column({ type: 'timestamp' })
  StartDate: Date;

  @Column({ type: 'timestamp' })
  EndDate: Date;

  @Column('int')
  StartPrice: number;

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
