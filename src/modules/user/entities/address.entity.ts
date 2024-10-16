import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  contact_name: string;

  @Column({ type: 'varchar', length: 60 })
  contact_number: string;

  @Column({ type: 'varchar', length: 60 })
  province: string;

  @Column({ type: 'varchar', length: 60 })
  city: string;

  @Column({ type: 'varchar', length: 60 })
  district: string;

  @Column({ type: 'int', width: 5 })
  zipcode: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 60 })
  note: string;

  @ManyToOne(() => User, (user) => user.addresses)
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
