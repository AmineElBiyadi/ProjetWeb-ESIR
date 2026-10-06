import { HttpException, Injectable } from '@nestjs/common';
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
    
    getAll(){
        return users;
    }

    getById(id: string){
        const user = users.find(u => u.id === parseInt(id));
        return user;
    }

    create(lastname: string , firstname: string, age: number): User {
        const newUser = new User (users.length, lastname, firstname, age);
    
        users.push(newUser);
        return newUser;
    
    }

    update(id: string, lastname: string , firstname: string, age: number) {
        const user = users.find(u=> u.id === parseInt(id));
        if (user){
            if(lastname !== undefined ){
                user.lastname = lastname;
            }
            if(firstname !== undefined ){
                user.firstname = firstname;
            }
            if(age !== undefined ){
                user.age = age;
            }
        }
        return user;
    }

    delete(id: string) {
        const user = users.find(u=> u.id === parseInt(id));
        if (user){
            const index = users.indexOf(user);
            users.splice(index, 1);
            return true ; 
        }
        return false;
    }


}
