import { Controller, Get,Body,Param, Put,Post, Delete, HttpException } from '@nestjs/common';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';



@Controller('users')
export class UsersController {
    constructor( private service: UsersService ) {}

    @Get()
    getAllUsers() {
        return this.service.getAll();
    }

    @Get (':id')
    getById(@Param('id') id: string){
        const user = this.service.getById(id);
        if (!user){
            throw new HttpException('User not found',404); 
        }
        return user;
    }

    @Post()
    createUser(@Body() input: any): User {
        return this.service.create(input.lastname, input.firstname, input.age);
    }

    @Put (':id')
    updateUser(@Param('id') id: string, @Body() input: any) {
        return this.service.update(id, input.lastname, input.firstname, input.age);
    }

    @Delete (':id')
    deleteUser(@Param('id') id: string  ) {
        return this.service.delete(id);
    }
    
}
