/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { UsersEntity } from "@/users/users.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'articles'})
export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    slug: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    body: string;

    @Column()
    title: string;

    @Column('text', { array: true, nullable: true })
    tagList?: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    @Column({ default: 0 })
    favoriteCount: number

    @Column({ default: false })
    favorited: boolean

    @ManyToOne(() => UsersEntity, (user) => user.articles)
    author: UsersEntity

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date()
    }
}