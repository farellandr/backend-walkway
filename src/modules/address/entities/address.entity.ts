import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @Column({ type: 'varchar', length: 5 })
  zipcode: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 60 })
  note: string;

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
