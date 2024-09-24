import { Role } from '#/role/entities/role.entity';
import { Payment } from "#/payment/entities/payment.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  // VersionColumn,n
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  salt: string;

  @Column({ type: 'text' })
  password: string;

  // @Column({ default: true })
  // isActive: boolean;

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

  // @VersionColumn()
  // version: number;

  @Column()
  roleId: string;

  @ManyToOne(
    () => {
      return Role;
    },
    (role) => {
      return role.users;
    },
  )
  role: Role;
  
  @OneToMany(() => Payment, (payment) => payment.user )
  payment: Payment;
}
