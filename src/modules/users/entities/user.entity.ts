import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        name: 'password_hash',
    })
    @Exclude()
    passwordHash: string;

    @Column({
        default: Role.USER,
    })
    role: Role;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date;
}