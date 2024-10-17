import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BidProduct } from "./bid-product.entity";
import { User } from "#/modules/user/entities/user.entity";

@Entity()
export class BidParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @ManyToOne(() => BidProduct, (bidProduct) => bidProduct.bidParticipants)
  bidProduct: BidProduct;
  @Column('uuid')
  bidProductId: string;

  @ManyToOne(() => User, (user) => user.bidParticipants)
  user: User;
  @Column('uuid')
  userId: string;

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