import { Controller, Get,Body,Param, Put,Post, Delete, HttpException } from '@nestjs/common';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserInput } from './userInput.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor( private service: UsersService ) {}

    @ApiOkResponse({ 
        description: 'Returns all users.',
        type: User,
        isArray: true 
    })
    @Get()
    getAllUsers() {
        return this.service.getAll();
    }
    
    @ApiOkResponse({ 
        description: 'Returns the user with the specified ID.', 
        type: User 
    })
    @ApiNotFoundResponse({ 
        description: 'User not found.' 
    })
    @Get (':id')
    getById(@Param('id') id: string){
        return this.service.getById(parseInt(id));
    }

    @ApiCreatedResponse({
        description: 'The user has been successfully created.',
        type: User,
    })
    @Post()
    async createUser(@Body() input: UserInput) : Promise<User> {
        return this.service.create(input.lastname, input.firstname, input.age);
    }

    @ApiOkResponse({ 
        description: 'Returns the updated user.', 
        type: User 
    })
    @ApiNotFoundResponse({ 
        description: 'User not found.' 
    })
    @Put (':id')
    async updateUser(@Param('id') id: string, @Body() input: UserInput) : Promise<User> {
        return this.service.update(parseInt(id), input.lastname, input.firstname, input.age);
    }

    @ApiOkResponse({ 
        description: 'The user has been successfully deleted.' 
    })
    @ApiNotFoundResponse({ 
        description: 'User not found.' 
    })
    @Delete (':id')
    deleteUser(@Param('id') id: string  ) {
        return this.service.delete(parseInt(id));
    }
    
}
