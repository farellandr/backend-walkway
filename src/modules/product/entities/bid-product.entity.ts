import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductDetail } from "./product-detail.entity";
import { BidParticipant } from "./bid-participant.entity";

@Entity()
export class BidProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  start_date: Date;

  @Column({
    type: 'timestamp with time zone',
  })
  end_date: Date;

  @Column({ type: 'int' })
  start_price: number;

  @ManyToOne(() => ProductDetail, (productDetail) => productDetail.bids)
  productDetail: ProductDetail;
  @Column({ type: 'uuid' })
  productDetailId: string;

  @OneToMany(() => BidParticipant, (bidParticipant) => bidParticipant.bidProduct)
  bidParticipants: BidParticipant[];

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