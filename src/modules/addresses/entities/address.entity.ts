import { User } from "#/modules/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    contactName: string;

    @Column()
    contactNumber: string;

    @Column()
    province: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    zipCode: string;

    @Column()
    address: string;

    @Column({ nullable: true })
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

    @ManyToOne(() => User, (user) => user.addresses)
    user: User
}
