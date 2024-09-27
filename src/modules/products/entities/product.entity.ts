import { Status } from "#/common/enums/status.enum";
import { BidProduct } from "#/modules/bid-products/entities/bid-product.entity";
import { Brand } from "#/modules/brands/entities/brand.entity";
import { Category } from "#/modules/categories/entities/category.entity";
import { ProductDetail } from "#/modules/product-details/entities/product-detail.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

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

    @ManyToOne(() => Brand, (brand) => brand.Product)
    brand: Brand;

    @OneToMany(() => ProductDetail, (details) => details.product)
    details: ProductDetail[]

    @ManyToMany(() => Category, (category) => category.products)
    @JoinTable({
        name: 'product_categories'
    })
    categories: Category[];

    @OneToMany(() => BidProduct, (bid) => bid.product)
    bids: BidProduct[];
}
