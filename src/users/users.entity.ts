/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ArticleEntity } from "@/article/article.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[]
}