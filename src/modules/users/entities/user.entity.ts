import { Address } from "#/modules/addresses/entities/address.entity";
import { Payment } from "#/modules/payments/entities/payment.entity";
import { Role } from "#/modules/roles/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    salt: string;

    @Column({ type: 'text' })
    password: string;

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

    @ManyToOne(() => Role, (role) => role.user)
    role: Role;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[]
}
