/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'users'})
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username', nullable: false })
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default: 'bio'})
    bio: string;

    @Column({default: ''})
    image: string;
}