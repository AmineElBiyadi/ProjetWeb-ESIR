import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { Association } from '../association/association.entity.js';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {

    @ApiProperty({ 
        description: 'The user ID', 
        example: 1, 
        type: Number, 
        readOnly: true 
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ 
        description: 'The user\'s last name', 
        example: 'Mohamed', 
        type: String 
    })
    @Column()
    lastname: string;
    
    @ApiProperty({ 
        description: 'The user\'s first name', 
        example: 'Amine', 
        type: String 
    })
    @Column()
    firstname: string;

    @ApiProperty({ 
        description: 'The user\'s age', 
        example: 30, 
        type: Number 
    })
    @Column()
    age: number ;
    
    @ManyToMany(() => Association, association => association.users)
    @JoinTable()   
    associations: Association[];

}