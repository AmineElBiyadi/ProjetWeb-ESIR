import { Injectable } from '@nestjs/common';
import { User } from './user.entity.js';


const users : User[] = [
    {
        id: 0,
        lastname: 'Doe',
        firstname: 'John',
        age: 23
    }
]

@Injectable()
export class UsersService {
    constructor( private service: UsersService ) {}

}
