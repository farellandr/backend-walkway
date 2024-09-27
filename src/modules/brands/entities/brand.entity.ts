import { Status } from "#/common/enums/status.enum";
import { Product } from "#/modules/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    img: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: Status

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

    @OneToMany(() => Product, (Product) => Product.brand)
    Product: Product[];
}
