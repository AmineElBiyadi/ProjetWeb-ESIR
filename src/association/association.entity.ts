import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from "../users/user.entity.js";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Association {

    @ApiProperty({ 
        description: 'The association ID', 
        example: 1, 
        type: Number, 
        readOnly: true 
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ 
        description: 'The association name', 
        example: 'Association RAHMA', 
        type: String 
    })
    @Column()
    name: string;

    @ApiProperty({
        description: 'Users belonging to this association',
        type: () => User,
        isArray: true,
    })
    @ManyToMany(() => User, user => user.associations ,{ eager: true })
    users: User[];  

}