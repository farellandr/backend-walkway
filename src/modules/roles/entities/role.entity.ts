import { User } from "#/modules/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    role: string;

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
        nullable: false,
    })
    deletedAt: Date;

    @OneToMany(() => User, (user) => user.role)
    user: User[];
}
