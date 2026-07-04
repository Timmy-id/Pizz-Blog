/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tags'})
export class TagsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}