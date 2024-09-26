import { BidProduct } from "#/bid-product/entities/bid-product.entity";
import { Payment } from "#/payment/entities/payment.entity";
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class BidParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BidProduct, (bidProduct) => bidProduct.bidUser)
  bidProduct: BidProduct[]
  @Column()
  bidProduct_id: string;

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment;
  @Column()
  payment_id: string;

  @Column('int')
  amount:number;

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
