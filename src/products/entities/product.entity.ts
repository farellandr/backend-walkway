import { Category } from "#/categories/entities/category.entity";
import { ProductDetail } from "#/product_details/entities/product_detail.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

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

    @ManyToMany(() => Category, (category) => category.products)
    @JoinTable({
        name: 'product_categories'
    })
    categories: Category[];

    @OneToMany(() => ProductDetail, (productDetails) => productDetails.product)
    productDetails: ProductDetail[]
}
