import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from "../users/user.entity.js";

@Entity()
export class Association {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, user => user.associations ,{ eager: true })
    users: User[];  

}