import { Controller, Get,Body,Param, Put,Post, Delete, HttpException } from '@nestjs/common';
import { User } from './user.entity.js';

const users : User[] = [
    {
        id: 0,
        lastname: 'Doe',
        firstname: 'John'
    }
]

@Controller('users')
export class UsersController {

    @Get()
    getAllUsers() {

        return users;
    }

    @Get (':id')
    getById(@Param('id') id: string){
        const user = users.find(u => u.id === parseInt(id));
        if (!user){
            throw new HttpException('User not found',404); 
        }
        return user;
    }

    @Post()
    createUser(@Body() input: any): User {
        const newUser = new User (users.length, input.lastname, input.firstname);
    
        users.push(newUser);
        return newUser;
    
    }

    @Put (':id')
    updateUser(@Param('id') id: string, @Body() input: any) {
        const user = users.find(u=> u.id === parseInt(id));
        if (user){
            if(input.lastname !== undefined ){
                user.lastname = input.lastname;
            }
            if(input.firstname !== undefined ){
                user.firstname = input.firstname;
            }
        }
        return user;
    }

    @Delete (':id')
    deleteUser(@Param('id') id: string  ) {
        const user = users.find(u=> u.id === parseInt(id));
        if (user){
            const index = users.indexOf(user);
            users.splice(index, 1);
            return true ; 
        }
        return false;
    }
    
}
