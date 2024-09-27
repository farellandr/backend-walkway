import { User } from "#/modules/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    paymentMethod: string;

    @Column()
    paymentTotal: number;

    @Column()
    status: string;

    @Column()
    vaNumber: string;

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

    @ManyToOne(() => User, (user) => user.payments)
    user: User;
}
