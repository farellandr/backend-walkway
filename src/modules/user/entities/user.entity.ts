import { Status } from "#/utils/enums/status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 60 })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  salt: string;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

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
