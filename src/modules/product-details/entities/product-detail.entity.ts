import { Product } from "#/modules/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ProductDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    size: number;

    @Column()
    stock: number;

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

    @ManyToOne(() => Product, (product) => product.details)
    product: Product
}
