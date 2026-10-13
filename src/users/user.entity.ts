import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { Association } from '../association/association.entity.js';
@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lastname: string;
    
    @Column()
    firstname: string;
    
    @Column()
    age: number ;
    
    @ManyToMany(() => Association, association => association.users)
    @JoinTable()   
    associations: Association[];

}