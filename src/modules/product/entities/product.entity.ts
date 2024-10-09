import { Brand } from "#/modules/brand/entities/brand.entity";
import { Status } from "#/utils/enums/status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'int' })
  price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

  @OneToMany(() => Brand, (brand) => brand.products)
  brand: Brand[];
  @Column({ type: 'uuid' })
  brandId: string;

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
